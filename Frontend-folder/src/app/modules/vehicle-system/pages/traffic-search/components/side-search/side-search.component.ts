import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import dayjs from 'dayjs/esm';
import { TimePeriod } from 'ngx-daterangepicker-material/daterangepicker.component';
import { Subscription } from 'rxjs';
import { SiteTreeNode } from 'src/app/modules/vehicle-system/components/site-selector/interfaces/http.response';
import { TrafficSearchService } from 'src/app/modules/vehicle-system/services/traffic-search/traffic-search.service';
import { CodeItemsApi, CodesArrayItem, DateKey, KeyValueType, customPositionType } from '../../../../interfaces/key-value-type';
import {
  CodeItemType,
  GetTrafficSearchListParams,
  TrafficSearchListParams,
  VehicleMakeKeyValueType,
  codeItemMapType,
} from '../../../../interfaces/traffic-search/traffic-search';
import { CodeItemService } from '../../../../services/global-subscription.service';
import { I18nService } from '../../../../utils/i18n.service';
import { getEndOfDayTimestamp, getStartOfDayTimestamp } from '../../../../utils/tool';

interface syncDataControlDataType {
  type: string,
  data: TimePeriod | null | SiteTreeNode[]
}

@Component({
  selector: 'vs-side-search',
  templateUrl: './side-search.component.html',
  styleUrls: [ './side-search.component.scss' ],
})

export class SideSearchComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() pageSize = 20;
  @Output() syncDataControlEmit: EventEmitter<syncDataControlDataType> = new EventEmitter<syncDataControlDataType>();
  @Output() getTrafficSearchListEmit: EventEmitter<GetTrafficSearchListParams> = new EventEmitter<GetTrafficSearchListParams>();

  activeLangValue!: string;
  codeDictList!: Array<CodeItemsApi>; // Code dictionary list
  currentDateTime!: Date; // Current time
  siteSelectedList: Array<SiteTreeNode> = [];
  isShowSiteTree = false;
  isDisabled = true; // Whether to disable
  isShowAdvancedSearch!: boolean; // Whether to show advanced search
  plateColorList: Array<KeyValueType> = []; // Plate color
  regionList: Array<KeyValueType> = []; // Region list
  currentRegion = 'all';
  categoryListMap: {[key:string]: KeyValueType[]} = {}; // Plate category
  selected!: TimePeriod | null; // Date range
  interval!: ReturnType<typeof setInterval>;
  trafficSearchForm!: UntypedFormGroup; // Traffic search form
  vehicleColorList: Array<KeyValueType> = []; // Vehicle color
  vehicleMarkList: Array<KeyValueType> = []; // Vehicle mark
  vehicleModelList: Array<KeyValueType> = []; // Vehicle model
  exactNumList: Array<KeyValueType> = []; // exact num
  customPosition!: customPositionType;

  private codeItemSub$!: Subscription;
  private behavior$!: Subscription;
  private endDateTime!: number | null; // End time
  private startDateTime!: number | null; // Start time
  private sitesList: SiteTreeNode[] = [];

  constructor(
    private codeItemService: CodeItemService,
    private formBuilder: UntypedFormBuilder,
    private i18nService: I18nService,
    private trafficSearchService: TrafficSearchService,
  ) {
  }

  /* --------------------------- life cycle --------------------------- */
  async ngOnInit(): Promise<void> {
    this.activeLangValue = this.i18nService.getLanguage();
    this.i18nService.getLanguageObservable().subscribe(lang => {
      this.activeLangValue = lang;
    });

    this.setCustomPosition();
    this.getCurrentTime();
    this.initFormData();
    this.initSubject();
  }

  ngAfterViewInit(): void {
    this.getHomeToTrafficSearchParams();
    this.getTrafficSearchList();
  }


  // destroy the timer and unsubscribe from the codeItemSub$ observable
  ngOnDestroy(): void {
    clearInterval(this.interval);
    this.codeItemSub$?.unsubscribe();
    this.behavior$?.unsubscribe();
  }

  /* --------------------------- public methods --------------------------- */
  private getHomeToTrafficSearchParams(): void {
    const params = sessionStorage.getItem('homeToTrafficSearchParams');
    if (params) {
      const homeToTrafficSearchParams = JSON.parse(params);
      this.selectorConfirmOn(homeToTrafficSearchParams.sites || []);
      this.selected = {
        startDate: dayjs(homeToTrafficSearchParams.startDateTime),
        endDate: dayjs(homeToTrafficSearchParams.endDateTime),
      };
      const paramDate = {
        startDate: homeToTrafficSearchParams.startDateTime,
        endDate: homeToTrafficSearchParams.endDateTime,
        curSelected: this.selected,
      };
      this.selectedDate(paramDate);
      sessionStorage.removeItem('homeToTrafficSearchParams');
    }
  }

  private setCustomPosition(): void {
    if(this.activeLangValue === 'en') {
      this.customPosition = {
        position: 'fixed',
        bottom: '-2rem',
        left: '-8rem',
      };
    }
    if(this.activeLangValue === 'ar') {
      this.customPosition = {
        position: 'fixed',
        bottom: '-2rem',
        left: '10rem',
      };
    }
  }

  selectedDate(event: DateKey): void {
    if (event.startDate && event.endDate) {
      this.startDateTime = event.startDate;
      this.endDateTime = event.endDate;
    }
    this.releaseCurDate(event);
  }

  // Get the search criteria and pass it to the parent component
  getTrafficSearchList(): void {
    const trafficSearchParams = new TrafficSearchListParams();
    const { plateCategory, exactNum, plateColor, plateNumber, region, vehicleColor, vehicleMake, vehicleModel, sites } = this.trafficSearchForm.value;
    trafficSearchParams.endDateTime = this.endDateTime;
    trafficSearchParams.startDateTime = this.startDateTime;
    trafficSearchParams.pageNo = 1;
    trafficSearchParams.pageSize = this.pageSize;
    trafficSearchParams.plateCategory = plateCategory || '';
    trafficSearchParams.exactNum = exactNum || 0;
    trafficSearchParams.plateColor = plateColor || '';
    trafficSearchParams.plateNumber = plateNumber || '';
    trafficSearchParams.region = region || '';
    trafficSearchParams.sites = sites || [];
    trafficSearchParams.vehicleColor = vehicleColor || '';
    trafficSearchParams.vehicleMake = vehicleMake || '';
    trafficSearchParams.vehicleModel = vehicleModel || '';
    const params: GetTrafficSearchListParams = {
      type: 'search',
      data: trafficSearchParams,
    };
    this.getTrafficSearchListEmit.emit(params);
  }

  // Reset the form
  resetForm(): void {
    this.trafficSearchForm.reset();
    this.trafficSearchForm.patchValue({exactNum: '1'});
    this.trafficSearchForm.patchValue({ sites: [] });
    this.initDateInputValue();
    this.getTrafficSearchList();
  }

  regionChange(event: KeyValueType): void {
    this.currentRegion = event ? event['value'] : '';
    const categoryList = this.categoryListMap[this.currentRegion] || [];
    const plateCategory = this.trafficSearchForm.get('plateCategory')?.value;
    let flag = true;
    for (let i = 0; i < categoryList.length; i++) {
      const element = categoryList[i];
      if (element['value'] === plateCategory) {
        flag = false;
        break;
      }
    }
    flag && this.trafficSearchForm.patchValue({ plateCategory: null });
  }

  clearRegion(): void {
    this.currentRegion = 'all';
    this.trafficSearchForm.patchValue({ plateCategory: null });
  }

  // Select the plate category
  onSelectChange(event: VehicleMakeKeyValueType): void {
    if (event?.value) {
      this.vehicleModelList = [];
      this.trafficSearchForm.get('vehicleModel')?.setValue(null);
      const vehicleMakeKey = `LprVehicleBrandType_${ event.value }`;
      this.codeDictList.forEach(item => {
        if (item.codeType === vehicleMakeKey) {
          this.lprVehicleModelFunc(item.codesArray);
        }
      });
      this.isDisabled = false;
      this.trafficSearchForm.get('vehicleModel')?.enable();
    } else {
      this.isDisabled = true;
      this.trafficSearchForm.get('vehicleModel')?.setValue(null);
      this.trafficSearchForm.get('vehicleModel')?.disable();
    }
  }

  // Display the advanced search
  showAdvancedSearch(): void {
    this.isShowAdvancedSearch = !this.isShowAdvancedSearch;
  }

  // Display the site selection modal
  showSiteModal(): void {
    this.siteSelectedList = this.trafficSearchForm.value.sites;
    this.isShowSiteTree = true;
  }

  // Receive the site selection modal data
  selectorConfirmOn(selectedList: SiteTreeNode[]): void {
    this.siteSelectedList = selectedList;
    this.trafficSearchForm.patchValue({ sites: selectedList });
    const params = { type: 'site', data: this.siteSelectedList };
    this.syncDataControlEmit.emit(params);
  }

  syncDataControlFunc(event: { type: string, data: DateKey | SiteTreeNode[] }): void {
    if (event.type === 'site') {
      this.siteSelectedList = event.data as SiteTreeNode[];
      this.trafficSearchForm.patchValue({ sites: event.data });
    }
  }

  lprVehicleModelFunc(codesArray: Array<CodesArrayItem>): void {
    this.vehicleModelList = this.codesArrayForEach(codesArray);
  }

  /* --------------------------- Private methods --------------------------- */
  private releaseCurDate(event: DateKey): void {
    this.trafficSearchService.businessToToolBoxDateChange$.next(event);
  }

  private initSubject(): void {
    this.behavior$ = this.trafficSearchService.toolBoxToBusinessDateChange$.subscribe(dateParams => {
      if (dateParams.startDate && dateParams.endDate) {
        this.selected = {
          startDate: dayjs(dateParams.startDate),
          endDate: dayjs(dateParams.endDate),
        };
        this.startDateTime = dateParams.startDate;
        this.endDateTime = dateParams.endDate;
      }
    });
  }

  // Initialize the current time and time iteration
  private getCurrentTime(): void {
    this.currentDateTime = new Date();
    this.interval = setInterval(() => {
      this.currentDateTime = new Date();
    }, 1000);
  }

  // Get code dictionary data
  private getDataDictionary(): void {
    this.codeItemSub$ = this.codeItemService.subject$.subscribe({
      next: res => {
        this.codeDictList = res.data;
        this.getCodeItemSuc(res.data);
      },
    });
  }

  private codeItemFuncMap: codeItemMapType = {
    'LprRegion': this.lprRegionFunc.bind(this),
    'LprCategory': this.lprAllRegionFunc.bind(this),
    'LprPlateColor': this.lprPlateColorFunc.bind(this),
    'LprVehicleColor': this.lprVehicleColorFunc.bind(this),
    'LprVehicleBrandType': this.lprVehicleMakeFunc.bind(this),
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
        if (codeItems.codeType === `LprRegion_${item['value']}`) {
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
  }

  private lprVehicleColorFunc(codesArray: Array<CodesArrayItem>): void {
    this.vehicleColorList = this.codesArrayForEach(codesArray);
  }

  private lprVehicleMakeFunc(codesArray: Array<CodesArrayItem>): void {
    this.vehicleMarkList = this.codesArrayForEach(codesArray);
  }

  private lprExactNumFunc(codesArray: Array<CodesArrayItem>): void {
    this.exactNumList = this.codesArrayForEach(codesArray);
  }

  private codesArrayForEach(codesArray: Array<CodesArrayItem>): Array<KeyValueType> {
    const list: Array<KeyValueType> = [];
    codesArray.forEach(item => {
      const key = this.activeLangValue === 'ar' ? item.arabItemName : item.englishItemName;
      const kvObj = { key, value: item.codeItemValue };
      list.push(kvObj);
    });
    return list;
  }

  private initDateInputValue(): void {
    this.selected = this.defDateRange();
    this.startDateTime = getStartOfDayTimestamp();
    this.endDateTime = getEndOfDayTimestamp();
  }

  private defDateRange = (): TimePeriod => {
    return {
      startDate: dayjs().subtract(0, 'days').set('hours', 0).set('minutes', 0).set('seconds', 0),
      endDate: dayjs().subtract(0, 'days').set('hours', 23).set('minutes', 59).set('seconds', 59),
    };
  };

  // Initialize the form
  private initFormData(): void {
    this.trafficSearchForm = this.formBuilder.group({
      region: null,
      plateCategory: null,
      exactNum: ['1'],
      plateNumber: null,
      plateColor: null,
      vehicleMake: null,
      vehicleModel: [ { value: null, disabled: true } ],
      vehicleColor: null,
      sites: [],
    });
    this.getDataDictionary();
    this.initDateInputValue();
  }
}
