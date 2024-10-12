import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import dayjs from 'dayjs/esm';
import { TimePeriod } from 'ngx-daterangepicker-material/daterangepicker.component';
import { Subscription } from 'rxjs';
import { FcMapType, FcType } from 'src/app/modules/vehicle-system/interfaces/ai-algorithm/ai-algorithm';
import { CodeItemsApi, CodesArrayItem, DateKey, KeyValueType } from 'src/app/modules/vehicle-system/interfaces/key-value-type';
import { InTrafficFineSearch } from 'src/app/modules/vehicle-system/interfaces/traffic-fine/traffic-fine';
import { GotraFficFine } from 'src/app/modules/vehicle-system/interfaces/vehicle-profile/vehicle-profile';
import { AllResourceList } from 'src/app/modules/vehicle-system/libs/path-library';
import { CodeItemService } from 'src/app/modules/vehicle-system/services/global-subscription.service';
import { TrafficFineService } from 'src/app/modules/vehicle-system/services/traffic-fine/traffic-fine.service';
import { FineConstLibrary } from '../../libs/traffic-fine-const-library';
type KeyValue = {key: string, value: string};
type CodeItemListType = Array<KeyValue>;
@Component({
  selector: 'vs-traffic-fine-search-form',
  templateUrl: './traffic-fine-search-form.component.html',
  styleUrls: ['./traffic-fine-search-form.component.scss'],
})
export class TrafficFineSearchFormComponent implements OnInit, OnDestroy {
  @Output() searchEventEmit: EventEmitter<InTrafficFineSearch> = new EventEmitter<InTrafficFineSearch>();

  codeDictList!: Array<CodeItemsApi>; // Code dictionary list
  currentDate!: string | Date; // current Date
  plateColorList:  CodeItemListType = []; // Plate color
  regionList: CodeItemListType = []; // Region list
  currentRegion = 'all';
  categoryListMap: {[key:string]: KeyValueType[]} = {}; // Plate category
  exactNumList: CodeItemListType = []; // exact num
  activeLangValue!: string;
  categoryBindValue!: string | undefined;
  exactNumBindValue: string | undefined = '1'; // 0: Exact 1: Fuzzy
  plateColorBindValue!: string | undefined;
  regionBindValue!: string | undefined;
  numberPlateBindValue!: string | undefined;
  locationBindValue!: string;
  selected!: TimePeriod | null;
  allResourceList = AllResourceList;
  allRadioAuthList = [
    {key: 'vs.trafficFine.fineType', value: '1', auth: this.allResourceList.TrafficFineFineType},
    {key: 'vs.trafficFine.numberPlate', value: '2', auth: this.allResourceList.TrafficFineNumberPlate},
  ];

  codeItemFuncMap: FcMapType = {
    'Lpr_G42_PLATE_REGIONS': this.lprRegionFunc.bind(this),
    'Lpr_G42_PLATE_CATEGORY_ALL': this.lprAllRegionFunc.bind(this),
    'LprPlateColor': this.lprPlateColorFunc.bind(this),
    'LprExactNum': this.lprExactNumFunc.bind(this),
  };

  private toDate!: number | null;
  private fromDate!: number | null;
  private codeItemSub$!: Subscription;
  private timer!: number | null;
  private behavior$!: Subscription;
  private selectTranslate$!: Subscription;
  private searchType!: string;

  constructor(
    private translocoService: TranslocoService,
    private codeItemService: CodeItemService,
    private trafficFineService: TrafficFineService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.initDateInputValue();
    this.initConfig();
    this.initSubject();
    this.getRouterParams();
    this.searchResult();
  }

  private initConfig(): void {
    this.activeLangValue = this.translocoService.getActiveLang();
    this.initSelectItemData();
    this.getCurrentTime();
  }

  private initSubject(): void {
    this.behavior$ = this.trafficFineService.toolBoxToBusinessDateChange$.subscribe(dateParams => {
      if (dateParams.startDate && dateParams.endDate) {
        // this.selected = {
        //   startDate: dayjs(dateParams.startDate),
        //   endDate: dayjs(dateParams.endDate),
        // };
        this.fromDate = dateParams.startDate;
        this.toDate = dateParams.endDate;
        this.searchResult();
      }
    });
  }

  private getRouterParams(): void {
    this.activatedRoute.queryParams.subscribe((params: GotraFficFine) => {
      if(Object.keys(params).length > 0) {
        this.exactNumBindValue = '0';
        this.regionBindValue = params.region || undefined;
        this.categoryBindValue = params.plateCategory || undefined;
        this.numberPlateBindValue = params.plateNumber;
        this.plateColorBindValue = params.plateColor;
        // this.selected =  {
        //   startDate: dayjs(Number(params.startDateTime)),
        //   endDate: dayjs(Number(params.endDateTime)),
        // };
        // this.toDate = params.endDateTime as number;
        // this.fromDate = params.startDateTime as number;
      }
    });
  }

  // Search based on form
  searchResult(): void {
    const inTrafficFineSearch: InTrafficFineSearch = this.preparationParams();
    this.searchEventEmit.emit(inTrafficFineSearch);
  }

  selectedDateEmit(event: DateKey): void {
    if (event.startDate && event.endDate) {
      this.toDate = event.endDate as number;
      this.fromDate = event.startDate as number;
    }
    this.releaseCurDate(event);
  }

  // Reset Form
  resetForm(): void {
    this.locationBindValue = '';
    this.categoryBindValue = undefined;
    this.exactNumBindValue = '1';
    this.plateColorBindValue = undefined;
    this.regionBindValue = undefined;
    this.numberPlateBindValue = undefined;
    this.initDateInputValue();
    this.searchResult();
  }


  private releaseCurDate(event: DateKey): void {
    this.trafficFineService.businessToToolBoxDateChange$.next(event);
  }

  private getCurrentTime(): void {
    this.currentDate = new Date();
    this.timer = window.setInterval(() => {
      this.currentDate = new Date();
    }, 1000);
  }

  private preparationParams(): InTrafficFineSearch {
    const inTrafficFineSearch = new InTrafficFineSearch();
    inTrafficFineSearch.fromDate = this.fromDate || '';
    inTrafficFineSearch.toDate = this.toDate || '';
    inTrafficFineSearch.plateRegion = this.regionBindValue || '';
    inTrafficFineSearch.plateCategory = this.categoryBindValue || '';
    inTrafficFineSearch.exactNum = this.exactNumBindValue;
    inTrafficFineSearch.plateNumber = this.numberPlateBindValue || '';
    inTrafficFineSearch.plateColor = this.plateColorBindValue || '';
    inTrafficFineSearch.searchType = this.searchType;
    return inTrafficFineSearch;
  }

  private initSelectItemData(): void {
    this.codeItemSub$ = this.codeItemService.subject$.subscribe(
      {
        next: res => {
          this.codeDictList = res.data;
          this.getCodeItemSuc(res.data);
        },
      },
    );
  }

  private getCodeItemSuc(resultItem: Array<CodeItemsApi>): void {
    resultItem.forEach(item => {
      const fn = this.codeItemFuncMap[item.codeType as keyof FcMapType] as FcType | undefined;
      if (fn) fn(item.codesArray);
    });
  }

  private codesArrayForEach(codesArray: Array<CodesArrayItem>): CodeItemListType {
    const list: CodeItemListType = [];
    codesArray.forEach(item => {
      const key = this.activeLangValue === FineConstLibrary.ar ? item.arabItemName : item.englishItemName;
      const kvObj = {key, value: item.codeItemValue};
      list.push(kvObj);
    });
    return list;
  }

  regionChange(event: KeyValueType): void {
    this.currentRegion = event ? event['value'] : '';
    const categoryList = this.categoryListMap[this.currentRegion] || [];
    let flag = true;
    for (let i = 0; i < categoryList.length; i++) {
      const element = categoryList[i];
      if (element['value'] === this.categoryBindValue) {
        flag = false;
        break;
      }
    }
    flag && (this.categoryBindValue = undefined);
  }

  clearRegion(): void {
    this.currentRegion = 'all';
    this.categoryBindValue = undefined;
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

  private lprExactNumFunc(codesArray: Array<CodesArrayItem>): void {
    this.exactNumList = this.codesArrayForEach(codesArray);
  }

  private initDateInputValue(): void {
    this.selected =  {
      // startDate: dayjs().startOf("day"),
      startDate: dayjs().subtract(365, 'days').startOf("day"),
      endDate: dayjs().endOf('day'),
    };
    this.toDate = this.selected.endDate.valueOf();
    this.fromDate = this.selected.startDate.valueOf();
  }

  ngOnDestroy(): void {
    if (this.codeItemSub$) this.codeItemSub$.unsubscribe();
    if (this.behavior$) this.behavior$.unsubscribe();
    if (this.selectTranslate$) this.selectTranslate$.unsubscribe();
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }
}
