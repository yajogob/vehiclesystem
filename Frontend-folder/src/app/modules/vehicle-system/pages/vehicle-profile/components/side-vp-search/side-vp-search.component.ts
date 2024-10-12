import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import dayjs from 'dayjs/esm';
import { TimePeriod } from 'ngx-daterangepicker-material/daterangepicker.component';
import { Subscription } from 'rxjs';
import { SiteTreeNode } from 'src/app/modules/vehicle-system/components/site-selector/interfaces/http.response';
import { CodeItemsApi, CodesArrayItem, DateKey, KeyValueType, customPositionType } from '../../../../interfaces/key-value-type';
import { TrafficSearchItem } from '../../../../interfaces/traffic-search/traffic-search';
import {
  CodeItemType, GetVehicleProfileListParams, VehicleProfileListParams,
  codeItemMapType,
} from '../../../../interfaces/vehicle-profile/vehicle-profile';
import { CodeItemService } from '../../../../services/global-subscription.service';
import { TrafficSearchStorageService } from '../../../../services/traffic-search/traffic-search-storage.service';
import { TrafficSearchConstLibrary } from '../../../traffic-search/libs/traffic-search-const-library';

interface dictItem {
  type: string;
  data: KeyValueType[];
}
@Component({
  selector: 'vs-side-vp-search',
  templateUrl: './side-vp-search.component.html',
  styleUrls: ['./side-vp-search.component.scss'],
})
export class SideVpSearchComponent implements OnInit, OnDestroy {
  @Input() activeIndex!: number;
  @Input() isShowVpDetails!: boolean;
  @Input() trafficSearchEnterShowArrow!: boolean;
  @Output() toggleBackButtonEmit: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() getVehicleProfileListEmit: EventEmitter<GetVehicleProfileListParams> = new EventEmitter<GetVehicleProfileListParams>();
  @Output() changeDetailsStateEmit: EventEmitter<void> = new EventEmitter<void>();
  @Output() changeTimeLineStateEmit: EventEmitter<null> = new EventEmitter<null>();
  @Output() getDataFromSideVpSearchComponentEmit: EventEmitter<dictItem> = new EventEmitter<dictItem>();
  @Output() resetSearch: EventEmitter<void> = new EventEmitter<void>();

  vehicleProfileSearchForm!: UntypedFormGroup; // Search data
  codeDictList!: Array<CodeItemsApi>; // Code dictionary list
  selected!: TimePeriod | null; // Date range
  activeLangValue!: string; // Current language
  plateColorList: Array<KeyValueType> = []; // Plate color
  vehicleColorList: Array<KeyValueType> = []; // Vehicle color
  vehicleTypeList: Array<KeyValueType> = []; // Vehicle color
  regionList: Array<KeyValueType> = []; // Lpr_G42_PLATE_REGIONS
  currentRegion = 'all';
  categoryListMap: {[key:string]: KeyValueType[]} = {}; // Plate category
  exactNumList: Array<KeyValueType> = []; // exact num
  siteSelectedList: Array<SiteTreeNode> = [];
  dtVisible = false;
  trafficSearchEnter = false;
  rotateArrow = false;
  customPosition!: customPositionType;

  private startDateTime!: number | null;
  private endDateTime!: number | null;
  private codeItemSub$!: Subscription;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private trafficSearchStorageService: TrafficSearchStorageService,
    private codeItemService: CodeItemService,
    private translocoService: TranslocoService,
  ) {}

  ngOnInit(): void {
    this.activeLangValue = this.translocoService.getActiveLang();
    this.setCustomPosition();
    this.initFormData();
    this.initDateInputValue();
    this.route.queryParams.subscribe(routeParams => {
      if (Object.keys(routeParams).length) {
        this.toggleBackButtonEmit.emit(true);
        const result = this.trafficSearchStorageService.commonAccess(TrafficSearchConstLibrary.CURRENT_TRAFFIC_SEARCH_DATA) as TrafficSearchItem;
        const params = this.removeNullEmpty(result);
        const {startDateTime, endDateTime} = params;
        if (startDateTime && endDateTime) {
          this.initDateInputValue(startDateTime, endDateTime);
        }
        this.trafficSearchEnter = true;
        this.currentRegion = params.region || '';
        this.vehicleProfileSearchForm.patchValue(params);
        // If there is license plate data, it should be an accurate query
        if (params.region) {
          const activeRegion = this.regionList.find((item:KeyValueType) => item['value'] === params.region);
          if (!activeRegion) {
            this.regionList.push({
              key: params.region,
              value: params.region,
            });
          }
        }
        if (params.category) {
          this.vehicleProfileSearchForm.patchValue({ 'plateCategory': params.category });
          if (!this.categoryListMap[this.currentRegion]) {
            this.categoryListMap[this.currentRegion] = [];
          }
          const categoryList:KeyValueType[] = this.categoryListMap[this.currentRegion];
          const activeCategory = categoryList.find((item:KeyValueType) => item['value'] === params.category);
          if (!activeCategory) {
            categoryList.push({
              key: params.category,
              value: params.category,
            });
          }
        }
        if (params.plateNumber) {
          this.vehicleProfileSearchForm.patchValue({ 'exactNum': '0' });
        }
        if (params.plateColor) {
          this.vehicleProfileSearchForm.patchValue({ 'plateColor': params.plateColorList });
        }
        this.getVehicleProfileList(); // Default query when entering traffic search
      }
    });
  }

  ngOnDestroy(): void {
    this.codeItemSub$?.unsubscribe();
  }

  private setCustomPosition(): void {
    if (this.activeLangValue === 'en') {
      this.customPosition = {
        position: 'fixed',
        bottom: '-2rem',
        left: '-8rem',
      };
    }
    if (this.activeLangValue === 'ar') {
      this.customPosition = {
        position: 'fixed',
        bottom: '-2rem',
        left: '10rem',
      };
    }
  }

  private getDataDictionary(): void {
    this.codeItemSub$ = this.codeItemService.subject$.subscribe({
      next: res => {
        this.codeDictList = res.data;
        this.getCodeItemSuc(res.data);
      },
    });
  }

  private codeItemFuncMap: codeItemMapType = {
    'Lpr_G42_PLATE_REGIONS': this.lprRegionFunc.bind(this),
    'Lpr_G42_PLATE_CATEGORY_ALL': this.lprAllRegionFunc.bind(this),
    'LprPlateColor': this.lprPlateColorFunc.bind(this),
    'LprVehicleColor': this.lprVehicleColorFunc.bind(this),
    'LprVehicleType': this.lprVehicleTypeFunc.bind(this),
    'LprExactNum': this.lprExactNumFunc.bind(this),
  };

  private getCodeItemSuc(resultItem: Array<CodeItemsApi>): void {
    resultItem.forEach(item => {
      const fn = this.codeItemFuncMap[item.codeType as keyof codeItemMapType] as CodeItemType | undefined;
      fn && fn(item.codesArray);
    });
  }

  private lprRegionFunc(codesArray: Array<CodesArrayItem>): void {
    this.regionList = this.codesArrayForEach(codesArray);
    this.regionList.forEach(item => {
      for (let i = 0; i < this.codeDictList.length; i++) {
        const codeItems = this.codeDictList[i];
        if (codeItems.codeType === `Lpr_G42_PLATE_REGIONS_${item['value']}`) {
          this.categoryListMap[item['value']] = this.codesArrayForEach(codeItems.codesArray);
          break;
        }
      }
    });
  }

  private lprAllRegionFunc(codesArray: Array<CodesArrayItem>): void {
    this.categoryListMap['all'] = this.codesArrayForEach(codesArray);
  }

  private lprPlateColorFunc(codesArray: Array<CodesArrayItem>): void {
    this.plateColorList = this.codesArrayForEach(codesArray);
    const params = {
      type: 'plateColor',
      data: this.plateColorList,
    };
    this.getDataFromSideVpSearchComponentEmit.emit(params);
  }

  private lprVehicleColorFunc(codesArray: Array<CodesArrayItem>): void {
    this.vehicleColorList = this.codesArrayForEach(codesArray);
    const params = {
      type: 'vehicleColor',
      data: this.vehicleColorList,
    };
    this.getDataFromSideVpSearchComponentEmit.emit(params);
  }

  private lprVehicleTypeFunc(codesArray: Array<CodesArrayItem>): void {
    this.vehicleTypeList = this.codesArrayForEach(codesArray);
    const params = {
      type: 'vehicleType',
      data: this.vehicleTypeList,
    };
    this.getDataFromSideVpSearchComponentEmit.emit(params);
  }

  private lprExactNumFunc(codesArray: Array<CodesArrayItem>): void {
    this.exactNumList = this.codesArrayForEach(codesArray);
  }

  private codesArrayForEach(codesArray: Array<CodesArrayItem>): Array<{ key: string, value: string }> {
    const list: Array<{ key: string, value: string }> = [];
    codesArray.forEach(item => {
      const key = this.activeLangValue === 'ar' ? item.arabItemName : item.englishItemName;
      const kvObj = { key, value: item.codeItemValue };
      list.push(kvObj);
    });
    return list;
  }

  /**
   * Initializes the form data
   */
  private initFormData(): void {
    this.vehicleProfileSearchForm = this.formBuilder.group({
      'region': null,
      'plateCategory': null,
      'exactNum': ['1'],
      'plateNumber': null,
      'plateColor': null,
      'sites': [],
    });
    this.getDataDictionary();
  }

  /**
   * Reset the form search criteria
   */
  resetForm(): void {
    this.vehicleProfileSearchForm.reset();
    this.initFormData();
    this.initDateInputValue();
    this.getVehicleProfileList();
    this.resetSearch.emit();
  }

  /**
   * Get form data
   */
  getVehicleProfileList(): void {
    const vehicleProfileListParams: VehicleProfileListParams = new VehicleProfileListParams();
    const { region, plateCategory, exactNum, plateNumber, plateColor, sites } = this.vehicleProfileSearchForm.value;
    vehicleProfileListParams.region = region || '';
    vehicleProfileListParams.plateCategory = plateCategory || '';
    vehicleProfileListParams.exactNum = exactNum || 1;
    vehicleProfileListParams.plateNumber = plateNumber || '';
    vehicleProfileListParams.plateColor = plateColor || '';
    vehicleProfileListParams.sites = sites || [];
    this.startDateTime && (vehicleProfileListParams.startDateTime = this.startDateTime);
    this.endDateTime && (vehicleProfileListParams.endDateTime = this.endDateTime);
    vehicleProfileListParams.pageNo = 1;
    vehicleProfileListParams.pageSize = 20;
    const params: GetVehicleProfileListParams = {
      trafficSearchEnter: this.trafficSearchEnter,
      type: 'search',
      data: vehicleProfileListParams,
    };
    this.getVehicleProfileListEmit.emit(params);
  }

  regionChange(event: KeyValueType): void {
    this.currentRegion = event ? event['value'] : '';
    const categoryList = this.categoryListMap[this.currentRegion] || [];
    const plateCategory = this.vehicleProfileSearchForm.get('plateCategory')?.value;
    let flag = true;
    for (let i = 0; i < categoryList.length; i++) {
      const element = categoryList[i];
      if (element['value'] === plateCategory) {
        flag = false;
        break;
      }
    }
    flag && this.vehicleProfileSearchForm.patchValue({ plateCategory: null });
  }

  clearRegion(): void {
    this.currentRegion = 'all';
    this.vehicleProfileSearchForm.patchValue({ plateCategory: null });
  }

  private initDateInputValue(startDateTime?: number, endDateTime?: number): void {
    if (startDateTime && endDateTime) {
      this.selected = {
        startDate: dayjs(startDateTime),
        endDate: dayjs(endDateTime),
      };
      this.startDateTime = startDateTime;
      this.endDateTime = endDateTime;
    } else {
      this.selected = {
        startDate: dayjs().subtract(6, 'days').startOf("day"),
        endDate: dayjs().subtract(0, 'days').endOf("day"),
      };
      this.startDateTime = dayjs().subtract(6, 'days').startOf("day").valueOf();
      this.endDateTime = dayjs().subtract(0, 'days').endOf("day").valueOf();
    }
  }

  selectedDate(event: DateKey): void {
    if (event.startDate && event.endDate) {
      this.startDateTime = event.startDate;
      this.endDateTime = event.endDate;
    }
  }

  changeDetailsState(): void {
    this.changeDetailsStateEmit.emit();
  }

  changeDetailsStateTsEnter(): void {
    this.rotateArrow = !this.rotateArrow;
    this.changeTimeLineStateEmit.emit();
  }

  showSiteModal(): void {
    this.siteSelectedList = this.vehicleProfileSearchForm.value.sites;
    this.dtVisible = true;
  }

  selectorConfirmOn(selectedList: SiteTreeNode[]): void {
    this.siteSelectedList = selectedList;
    this.vehicleProfileSearchForm.patchValue({ sites: selectedList });
  }

  private removeNullEmpty = (obj: TrafficSearchItem): TrafficSearchItem => {
    const cleanedObj: { [key: string]: boolean | string | number | string[] | undefined | null } = {};
    Object.keys(obj).forEach(key => {
      if (obj[key as keyof TrafficSearchItem]) {
        cleanedObj[key] = obj[key as keyof TrafficSearchItem];
      }
    });
    return cleanedObj as TrafficSearchItem;
  };
}
