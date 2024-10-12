import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import dayjs from 'dayjs/esm';
import { TimePeriod } from 'ngx-daterangepicker-material/daterangepicker.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription, finalize } from 'rxjs';
import { SiteTreeNode } from '../../components/site-selector/interfaces/http.response';
import { Tool } from '../../components/toolbox';
import { ToolboxComponent } from '../../components/toolbox/toolbox.component';
import {
  CodeItemType, FakePlateSearchItem, FakePlateSearchParams, FakePlateSearchResponse, GetFakePlateSearchParams, LayerInfoResponse,
  OutTrafficCheckPlateResult,
  codeItemMapType,
} from '../../interfaces/fake-plate/fake-plate';
import { CodeItemsApi, CodesArrayItem, DateKey, KeyValueType, SelectType } from '../../interfaces/key-value-type';
import { TrafficSearchItem, TrafficSearchListParams } from '../../interfaces/traffic-search/traffic-search';
import { AllResourceList, PathLib } from '../../libs/path-library';
import { MessageService } from '../../services/common/message.service';
import { FakePlateBusinessService } from '../../services/fake-plate/fake-plate-business.service';
import { FakePlateService } from '../../services/fake-plate/fake-plate.service';
import { CodeItemService } from '../../services/global-subscription.service';
import { RouterService } from '../../services/router.service';
import { TrafficSearchService } from '../../services/traffic-search/traffic-search.service';
import { FakePlateSideSearchComponent } from './components/fake-plate-side-search/fake-plate-side-search.component';

@Component({
  selector: 'vs-fake-plate',
  templateUrl: './fake-plate.component.html',
  styleUrls: ['./fake-plate.component.scss'],
})
export class FakePlateComponent implements OnInit, OnDestroy {

  @ViewChild('fakePlateSideSearch') fakePlateSideSearch: FakePlateSideSearchComponent | undefined;
  @ViewChild('vsToolbox') vsToolbox: ToolboxComponent | undefined;

  isShowDrawer!: boolean;
  layerInfo!: LayerInfoResponse;
  activeLangValue!: string;
  fakePlateSearchParams: FakePlateSearchParams = new FakePlateSearchParams();
  plateColorList: Array<KeyValueType> = []; // Plate color
  vehicleMarkList: Array<KeyValueType> = []; // Vehicle mark
  fakeInformationStatusList: Array<KeyValueType> = []; // Fake information status
  fakeSearchTypeList: Array<KeyValueType> = []; // Fake search type
  regionList: Array<KeyValueType> = []; // Region list
  currentRegion = 'all';
  categoryListMap: {[key:string]: KeyValueType[]} = {}; // Plate category
  exactNumList: Array<KeyValueType> = []; // exact num
  vehicleModelList: Array<KeyValueType> = []; // Vehicle model
  fakePlateCheckList: Array<KeyValueType> = [];
  fakePlateCheckMap: KeyValueType = {};
  codeDictList!: Array<CodeItemsApi>; // Code dictionary list
  fakePlateList: Array<FakePlateSearchItem> = [];
  noDataBaseList: Array<OutTrafficCheckPlateResult> = [];
  totalElements = 0;
  siteSelectedList: Array<SiteTreeNode> = [];
  showLocationFlag=false;
  selectedDate!: TimePeriod | null;
  toolSet: Tool[] = [];
  selectOptions: Array<SelectType> = [];
  showLevel2Select = false;
  trafficSearchPageNo = 1;
  trafficSearchTotal = 0;
  trafficSearchTableList: Array<TrafficSearchItem> = [];
  isNoDataBase = '';
  trafficCheckPlateItem!: OutTrafficCheckPlateResult;
  allResourceList = AllResourceList;

  private codeItemSub$!: Subscription;
  private businessToTool$!: Subscription;

  constructor(
    private fakePlateService: FakePlateService,
    private loadingService: NgxUiLoaderService,
    private codeItemService: CodeItemService,
    private translocoService: TranslocoService,
    private messageService: MessageService,
    private routerService: RouterService,
    private fakePlateBusinessService: FakePlateBusinessService,
    private trafficSearchService: TrafficSearchService,
  ) {
  }

  ngOnInit(): void {
    this.activeLangValue = this.translocoService.getActiveLang();
    if (this.activeLangValue === 'en') {
      this.toolSet = [{
        code: 'All_Alert',
        category: 'View',
        value: 'All Alert',
        arrowIcon: true,
      }, {
        code: 'Fake_Plate',
        category: 'View / Search',
        value: 'Fake Plate',
        arrowIcon: false,
        accessName: this.allResourceList.AlertFakePlate,
      }];
      this.selectOptions = [
        {label: 'All Alert', value: ''},
        {label: 'Watch List Alert', value: 'watchList', accessName: this.allResourceList.WatchListListAlerts},
        {label: 'Behavioral Alert', value: 'behavioral', accessName: this.allResourceList.BehavioralListAlerts},
        {label: 'Geofence Alert ', value: 'geofenceList', accessName: this.allResourceList.GeofenceListAlerts},
        {label: 'No Number Plate', value: 'noNumberPlate', accessName: this.allResourceList.AlertNoNumberPlate},
      ];
    } else if (this.activeLangValue === 'ar') {
      this.toolSet = [{
        code: 'All_Alert',
        category: 'منظر',
        value: 'الكل تنبيه',
        arrowIcon: true,
      }, {
        code: 'Fake_Plate',
        category: 'منظر / بحث',
        value: 'لوحة مزورة',
        arrowIcon: false,
        accessName: this.allResourceList.AlertFakePlate,
      }];
      this.selectOptions = [
        {label: 'الكل تنبيه', value: ''},
        {label: 'تنبيه قائمة المراقبة', value: 'watchList', accessName: this.allResourceList.WatchListListAlerts},
        {label: 'إنذار سلوكي', value: 'behavioral', accessName: this.allResourceList.BehavioralListAlerts},
        {label: 'إنذار جوفانس', value: 'geofenceList', accessName: this.allResourceList.GeofenceListAlerts},
        {label: 'بدون لوحة مركبة', value: 'noNumberPlate', accessName: this.allResourceList.AlertNoNumberPlate},
      ];
    }
    this.getDataDictionary();
    this.initSubject();
  }

  private initSubject(): void {
    this.businessToTool$ = this.fakePlateService.businessToToolBoxDateChange$.subscribe(params => {
      this.selectedDate = params?.curSelected as TimePeriod;
    });
  }

  ngOnDestroy(): void {
    this.codeItemSub$?.unsubscribe();
    this.businessToTool$?.unsubscribe();
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
    'LprRegion': this.lprRegionFunc.bind(this),
    'LprCategory': this.lprAllRegionFunc.bind(this),
    'LprPlateColor': this.lprPlateColorFunc.bind(this),
    'LprVehicleBrandType': this.lprVehicleMakeFunc.bind(this),
    'LprFakeInformationStatus': this.lprFakeInformationFunc.bind(this),
    'LprFakeSearchType': this.lprFakeSearchTypeFunc.bind(this),
    'LprExactNum': this.lprExactNumFunc.bind(this),
    'LprFakePlateCheck': this.LprFakePlateCheckFunc.bind(this),
  };

  /* ---------------------- methods ---------------------- */
  getFakePlateList(event: GetFakePlateSearchParams): void {
    this.isNoDataBase = event.isNoDataBase || '';
    switch (event.type) {
      case 'page':
        if(this.isNoDataBase === '1') {
          this.trafficSearchPageNo = event.data as number;
        } else {
          typeof event.data === 'number' && (this.fakePlateSearchParams.pageNo = event.data);
        }
        this.selectRequset(event.type);
        break;
      case 'search':
        if (typeof event.data === 'object') {
          this.fakePlateSearchParams = event.data;
        }
        this.selectRequset(event.type);
        break;
    }
  }

  selectRequset(type: string) : void {
    if(this.isNoDataBase === '1') {
      type === 'page' ? this.trafficSearch() : this.trafficCheckPlate();
    } else {
      this.getFakePlateTableList();
    }
  }

  trafficSearch(): void {
    const inTrafficSearchListParams = new TrafficSearchListParams();
    inTrafficSearchListParams.region = this.trafficCheckPlateItem.region;
    inTrafficSearchListParams.plateCategory = this.trafficCheckPlateItem.plateCategory;
    inTrafficSearchListParams.plateNumber = this.trafficCheckPlateItem.plateNumber;
    inTrafficSearchListParams.exactNum = this.fakePlateSearchParams.exactNum;
    inTrafficSearchListParams.plateColor = this.fakePlateSearchParams.plateColor || '';
    inTrafficSearchListParams.sites = this.fakePlateSearchParams.sites;
    inTrafficSearchListParams.startDateTime = this.fakePlateSearchParams.startDateTime;
    inTrafficSearchListParams.endDateTime = this.fakePlateSearchParams.endDateTime;
    inTrafficSearchListParams.pageNo = this.trafficSearchPageNo;
    inTrafficSearchListParams.pageSize = 10;

    this.trafficSearchService.getTrafficSearchTableList(inTrafficSearchListParams).subscribe(
      {
        next: res => {
          if (res?.result) {
            this.trafficSearchTableList = res.result.content || [];
            this.trafficSearchTotal = res.result.totalElements || 0;
          } else {
            res.message && this.messageService.error(res.message);
          }
        },
        error: err => {
          err.message && this.messageService.error(err.message);
        },
      },
    );
  }

  private getFakePlateTableList(): void {
    this.loadingService.startLoader('loader-fake-number-plate');
    const res = this.fakePlateService.getFakePlateTableList(this.fakePlateSearchParams);
    res.pipe(
      finalize(() => {
        this.loadingService.stopLoader('loader-fake-number-plate');
      }),
    ).subscribe((data: FakePlateSearchResponse) => {
      if (data?.result?.content) {
        this.fakePlateList = data.result.content.map(item => {
          const vehicleModelListParent = this.getVehicleModelList(item.vehicleMake);
          const vehicleModelListChild = this.getVehicleModelList(item.lastVehicle.vehicleMake);
          item.lastVehicle.captureDateTime = dayjs(item.lastVehicle.captureDateTime).format('MMM D, YYYY h:mm A');
          item.lastVehicle.vehicleMake = (this.vehicleMarkList.find(mark => mark['value'] === item.lastVehicle.vehicleMake)?.['key']) as string;
          item.lastVehicle.vehicleModel = (vehicleModelListChild.find(mark => mark['value'] === item.lastVehicle.vehicleModel)?.['key']) as string;
          return {
            ...item,
            plateColor: this.plateColorList.find(color => color['value'] === item.plateColor)?.['key'],
            vehicleMake: (this.vehicleMarkList.find(mark => mark['value'] === item.vehicleMake)?.['key']) as string,
            vehicleModel: (vehicleModelListParent.find(mark => mark['value'] === item.vehicleModel)?.['key']) as string,
            currentStatus: this.fakeInformationStatusList.find(status => status['value'] === item.currentStatus)?.['key'],
            searchType: this.fakeSearchTypeList.find(type => type['value'] === item.searchType)?.['key'],
            captureDateTime: dayjs(item.captureDateTime).format('MMM D, YYYY h:mm A'),
          };
        });
        this.totalElements = data.result.totalElements || 0;
        this.noDataBaseList = [];
      }
    });
  }

  private trafficCheckPlate(): void {
    this.loadingService.startLoader('loader-no-database');
    this.fakePlateBusinessService.trafficCheckPlate(this.fakePlateSearchParams)
      .pipe(finalize(() => this.loadingService.stopLoader('loader-no-database')))
      .subscribe(
        {
          next: res => {
            this.noDataBaseList = res;
          },
        },
      );
  }

  handleCheckedEmit(event: OutTrafficCheckPlateResult): void {
    this.trafficSearchPageNo = 1;
    this.trafficCheckPlateItem = event;
    this.trafficSearch();
  }

  checkFakePlateEmit(event: string): void {
    const params = {
      id: this.layerInfo.id,
      informationStatus: event,
    };
    this.fakePlateService.checkFakePlate(params).subscribe(res => {
      if (res.result) {
        this.messageService.success('success');
        this.closeDrawerEmit(false);
        this.getFakePlateList({ type: 'search', data: this.fakePlateSearchParams });
      } else {
        // todo: error message
      }
    });
  }

  getLayerInfo(event: LayerInfoResponse): void {
    this.layerInfo = event;
  }

  openDrawerEmit(event: boolean): void {
    this.isShowDrawer = event;
  }

  closeDrawerEmit(event: boolean): void {
    this.isShowDrawer = event;
  }

  /* ---------------------- private methods ---------------------- */

  private getCodeItemSuc(resultItem: Array<CodeItemsApi>): void {
    resultItem.forEach(item => {
      const fn = this.codeItemFuncMap[item.codeType as keyof codeItemMapType] as CodeItemType | undefined;
      fn && fn(item.codesArray);
    });
  }

  regionChange(event: KeyValueType | null): void {
    this.currentRegion = event ? event['value'] : 'all';
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

  private lprFakeInformationFunc(codesArray: Array<CodesArrayItem>): void {
    this.fakeInformationStatusList = this.codesArrayForEach(codesArray);
  }

  private lprFakeSearchTypeFunc(codesArray: Array<CodesArrayItem>): void {
    this.fakeSearchTypeList = this.codesArrayForEach(codesArray);
  }

  private lprExactNumFunc(codesArray: Array<CodesArrayItem>): void {
    this.exactNumList = this.codesArrayForEach(codesArray);
  }

  private lprVehicleMakeFunc(codesArray: Array<CodesArrayItem>): void {
    this.vehicleMarkList = this.codesArrayForEach(codesArray);
  }

  private lprVehicleModelFunc(codesArray: Array<CodesArrayItem>): void {
    this.vehicleModelList = this.codesArrayForEach(codesArray);
  }

  private LprFakePlateCheckFunc(codesArray: Array<CodesArrayItem>): void {
    this.fakePlateCheckList = this.codesArrayForEach(codesArray);
    this.fakePlateCheckList.forEach(item => {
      this.fakePlateCheckMap[item['value']] = item['key'];
    });
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

  private getVehicleModelList(event: string): Array<KeyValueType> {
    this.vehicleModelList = [];
    const vehicleMakeKey = `LprVehicleBrandType_${event}`;
    let vehicleModelList: Array<KeyValueType> = [];
    this.codeDictList.forEach(item => {
      if (item.codeType === vehicleMakeKey) {
        vehicleModelList = this.codesArrayForEach(item.codesArray);
      }
    });
    return vehicleModelList;
  }

  // Hide <vs-map-controller> when location-select is visibled
  changeLocationVisible(flag: boolean):void {
    this.showLocationFlag = flag;
  }

  selectorConfirmOn(selectedList: SiteTreeNode[]): void {
    this.siteSelectedList = selectedList;
    const params = {
      type: 'site',
      data: this.siteSelectedList,
    };
    this.fakePlateSideSearch?.syncDataControlFunc(params);
  }

  showDeviceTree():void {
    this.vsToolbox?.showDeviceTree();
  }

  onSelectedDateEmit(event: DateKey): void {
    this.fakePlateService.toolBoxToBusinessDateChange$.next(event);
  }

  syncDataControlEmit(event: { type: string, data: SiteTreeNode[] | TimePeriod | null }): void {
    if (event.type === 'date') {
      this.selectedDate = event.data as TimePeriod;
    } else {
      this.siteSelectedList = event.data as SiteTreeNode[];
    }
  }

  // eslint-disable-next-line class-methods-use-this
  changeSelectedFn(taskValue: string): void {
    const params = { taskType: taskValue };
    this.routerService.navigate([PathLib.ALERT], { queryParams: params });
  }

  changeLevel2SelectVisibleFn(flag:boolean): void {
    this.showLevel2Select = flag;
  }

  onClickbackFn(tool: Tool): void {
    if (tool.code == 'All_Alert') this.showLevel2Select = true;
  }
}
