import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import dayjs from 'dayjs/esm';
import { TimePeriod } from 'ngx-daterangepicker-material/daterangepicker.component';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { Subscription, finalize, tap } from 'rxjs';
import { SiteTreeNode } from '../../components/site-selector/interfaces/http.response';
import { Tool } from '../../components/toolbox';
import { ToolboxComponent } from '../../components/toolbox/toolbox.component';
import { OutNoNumberPlateList } from '../../interfaces/alert/http.params';
import { BehavioralAlert, GeofenceAlert, WatchlistAlert } from '../../interfaces/alert/http.response';
import { AlertsData, AllAlertsSearchRes } from '../../interfaces/basic-map/http.response';
import { TrafficParams } from '../../interfaces/home/http.params';
import {
  BehavioralAlertData,
  BehavioralAlertLineData,
  BehavioralAlertsStatisticsByTimeRes,
  BehavioralAlertsStatisticsRes,
} from '../../interfaces/home/http.response';
import { CustomRanges, DateKey, SelectType, customPositionType } from '../../interfaces/key-value-type';
import { AllResourceList, PathLib } from '../../libs/path-library';
import { AlertHttpRequest } from '../../services/alert/http.service';
import { MapHttpRequest } from '../../services/basic-map/http.service';
import { GlobalSubscriptionService } from '../../services/global-subscription.service';
import { HomeHttpRequest } from '../../services/home/http.service';
import { MapService } from '../../services/map-event.service';
import { RouterService } from '../../services/router.service';
import { I18nService } from '../../utils/i18n.service';

export class ToolStyle {
  'margin-left'?: string;
  'margin-right'?: string;
}

@Component({
  selector: 'vs-alert-map',
  templateUrl: './alert-map.component.html',
  styleUrls: ['./alert-map.component.scss'],
})
export class AlertMapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('toolboxObj') toolbox: ToolboxComponent | undefined;
  @ViewChild('tool')
  set tool(ele: ElementRef) {
    this._tool = ele;
  }

  get tool(): ElementRef {
    return this._tool;
  }

  private _tool!: ElementRef;

  language='';
  showBigBehavioralAlert = false;
  showTimer = 0;
  hiddenAlertSearch=false;
  activedTab='';
  showAllTask=false;
  showNewTask=false;
  newTaskType='';
  ranges: CustomRanges[] = [];
  selectedList: SiteTreeNode[] = [];
  defaultDate: TimePeriod = {
    startDate: dayjs().startOf("day"),
    endDate: dayjs().endOf('day'),
  };

  showLocationFlag=false;
  copyTrafficSitesParams?:TrafficParams;
  trafficSitesParams:TrafficParams = {
    sites: [],
    startDateTime: '',
    endDateTime: '',
  };

  behavioralAlertLoading=false;
  behavioralAlertChartOption:Array<BehavioralAlertData>=[];
  behavioralAlertLineChartOption:Array<BehavioralAlertLineData>=[];

  selectTitle='';
  selectedLabel='';
  showLevel2Select=false;
  showDateSelect=false;
  toolSet: Tool[] = [];
  selectOptions:Array<SelectType>=[];
  getAllAlertLoading=false;
  alertLocations: Array<AlertsData>=[];
  showAlertPointDetail=false;
  cameraId='';
  alertId='';
  detailAlertPosition='';
  detailAlertType='';
  currentTableData!: WatchlistAlert | GeofenceAlert | OutNoNumberPlateList;
  selectTranslate$!: Subscription; // in AlertMapLeaveGuard have unsubscribe
  businessToTool$!: Subscription; // in AlertMapLeaveGuard have unsubscribe
  alertSubject$!: Subscription; // in AlertMapLeaveGuard have unsubscribe
  showAlertTableModal = false;
  customPosition!: customPositionType;
  allResourceList = AllResourceList;


  private localeI18nValue: string[] = [];
  private localeI18nKey = [
    'vs.dateinput.today',
    'vs.dateinput.last7days',
    'vs.dateinput.last30days',
    'vs.dateinput.this.year',
    'vs.dateinput.customRangeLabel',
  ];

  constructor(
    private i18nService: I18nService,
    private routerService: RouterService,
    private mapService: MapService,
    private router: Router,
    private mapHttpRequest: MapHttpRequest,
    private route: ActivatedRoute,
    private homeHttpRequest: HomeHttpRequest,
    private loadingService: NgxUiLoaderService,
    private translocoService: TranslocoService,
    private alertHttpRequest: AlertHttpRequest,
    private globalSubscriptionService: GlobalSubscriptionService,
  ) {}


  /* Lifecycle function  -----start */
  ngOnInit():void {
    this.mapService.subject.next({
      eventType: 'set-page-on-gomap',
      data: {type: '/alert'},
    });

    this.transloco();
    this.initSubject();
    this.language = this.i18nService.getLanguage();
    this.setCustomPosition();
    if (this.language === 'en') {
      this.toolSet = [{
        code: 'All_Alert',
        category: 'Alert',
        value: 'All Alert',
        arrowIcon: true,
      }, {
        code: 'Fake_Plate',
        category: 'View / Search',
        value: 'Fake Plate',
        arrowIcon: false,
        accessName: this.allResourceList.AlertFakePlate,
      }];
      this.selectTitle = 'Alert';
      this.selectOptions = [
        {label: 'All Alerts', value: ''},
        {label: 'Watchlist Alerts', value: 'watchList', accessName: this.allResourceList.WatchListListAlerts},
        {label: 'Behavioral Alerts', value: 'behavioral', accessName: this.allResourceList.BehavioralListAlerts},
        {label: 'Geofence Alerts ', value: 'geofenceList', accessName: this.allResourceList.GeofenceListAlerts},
        {label: 'No Number Plate', value: 'noNumberPlate', accessName: this.allResourceList.AlertNoNumberPlate},
      ];
    } else if (this.language === 'ar') {
      this.toolSet = [{
        code: 'All_Alert',
        category: 'إنذار',
        value: 'جميع الإنذارات',
        arrowIcon: true,
      }, {
        code: 'Fake_Plate',
        category: 'عرض/بحث',
        value: 'لوحة مزورة',
        arrowIcon: false,
        accessName: this.allResourceList.AlertFakePlate,
      }];
      this.selectTitle = 'تنبيه';
      this.selectOptions = [
        {label: 'جميع الإنذارات', value: ''},
        {label: 'إنذارات قائمة المراقبة ', value: 'watchList', accessName: this.allResourceList.WatchListListAlerts},
        {label: 'إنذارات سلوكية', value: 'behavioral', accessName: this.allResourceList.BehavioralListAlerts},
        {label: 'إنذارات الحدود الجغرافية', value: 'geofenceList', accessName: this.allResourceList.GeofenceListAlerts},
        {label: 'بدون لوحة مركبة', value: 'noNumberPlate', accessName: this.allResourceList.AlertNoNumberPlate},
      ];
    }

    this.setAlertSearch('');

    // Listen for route parameter
    this.alertSubject$ = this.mapService.subject.subscribe(({eventType, data}) => {
      switch (eventType) {
        case 'alert-search':
          this.setAlertSearch(data.alertType || '');
          break;
        case 'set-alert-map-marker-details':
          this.setDetailAlertPosition(data.alertPosition || '');
          this.setDetailAlertType(data.alertType || '');
          if (data.watchlistDetail) {
            this.openAlertDetail(data.watchlistDetail);
          } else if (data.geofenceDetail) {
            this.openAlertDetail(data.geofenceDetail);
          }
          break;
        case 'set-alert-table-modal':
          this.setDetailAlertPosition(data.alertPosition || '');
          this.setDetailAlertType(data.alertType || '');
          this.openAlertTableModal(data.tableData as WatchlistAlert | BehavioralAlert | GeofenceAlert | OutNoNumberPlateList);
          break;
        case 'set-alert-map-marker-details-close':
          this.closeDetail();
          break;
      }
    });

    // Set of fake plate page after the logical processing
    this.route.queryParams.subscribe(async params => {
      if (Object.keys(params).length && params['taskType']) {
        this.setAlertSearch(params['taskType'] || '');
      }
    });

    this.getBehavioralAlertData();
    // After leaving "/alert", clear loading on this page
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd){
        this.loadingService.destroyLoaderData('watchlist-alert-loader');
        this.loadingService.destroyLoaderData('behavioral-alert-loader');
        this.loadingService.destroyLoaderData('geofence-alert-loader');
        this.loadingService.destroyLoaderData('new-task-loader');
        this.loadingService.destroyLoaderData('behavioral-alert-map-loader');
        this.loadingService.destroyLoaderData('no-number-plate-loader');
      }
    });

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      document.addEventListener("fullscreenchange", () => {
        if (document.fullscreenElement) {
          const obj = this.customPosition;
          obj.bottom = '-22rem';
          this.customPosition = obj;
        } else {
          const obj = this.customPosition;
          obj.bottom = '-16.6rem';
          this.customPosition = obj;
        }
      });
    }, 0);
  }

  ngOnDestroy(): void {
    this.mapService.subject.next({
      eventType: 'set-alert-map-marker-details-close',
      data: {},
    });
  }

  /* Lifecycle function  -----end */

  /* custom function   -----start */
  private setCustomPosition(): void {
    if(this.language === 'en') {
      this.customPosition = {
        position: 'fixed',
        bottom: '-16.6rem',
        left: '2.6rem',
      };
    }
    if(this.language === 'ar') {
      this.customPosition = {
        position: 'fixed',
        bottom: '-16.6rem',
        left: '-2.2rem',
      };
    }
  }

  private initSubject(): void {
    this.businessToTool$ = this.alertHttpRequest.businessToToolBoxDateChange$.subscribe(params => {
      this.defaultDate = params?.curSelected as TimePeriod;
    });
  }

  private transloco(): void {
    this.localeI18nKey.forEach(key => {
      this.selectTranslate$ = this.translocoService.selectTranslate(key).subscribe(value => {
        this.localeI18nValue.push(value);
        if(this.localeI18nKey.length === this.localeI18nValue.length) {
          this.translateRanges();
        }
      });
    });
  }

  private translateRanges(): void {
    this.ranges = [
      {
        [this.localeI18nValue[0]]: {
          startDate: dayjs().startOf("day"),
          endDate: dayjs().endOf('day'),
        },
      }, {
        [this.localeI18nValue[1]]: {
          startDate: dayjs().subtract(6, 'days').startOf("day"),
          endDate: dayjs().endOf('day'),
        },
      }, {
        [this.localeI18nValue[2]]: {
          startDate: dayjs().subtract(30, 'days').startOf("day"),
          endDate: dayjs().endOf('day'),
        },
      }, {
        [this.localeI18nValue[3]]: {
          startDate: dayjs().subtract(365, 'days').startOf("day"),
          endDate: dayjs().endOf('day'),
        },
      }, { [this.localeI18nValue[4]]: undefined },
    ];
  }

  initSearch(range: TimePeriod):void {
    this.trafficSitesParams.startDateTime = range.startDate.valueOf();
    this.trafficSitesParams.endDateTime = range.endDate.valueOf();
    if (this.hiddenAlertSearch) {
      this.getAlertMapAllAlerts();
    }
  }

  // Hide <vs-map-controller> when location-select is visibled
  changeLocationVisible(flag: boolean):void {
    this.showLocationFlag = flag;
  }

  onDeviceTreeChange(data: SiteTreeNode[]): void {
    this.selectedList = data;
    this.trafficSitesParams.sites = data;
    // Triggers the change event for the component
    this.trafficSitesParams = JSON.parse(JSON.stringify(this.trafficSitesParams));
    this.getAlertMapAllAlerts();
    this.getBehavioralAlertData();
  }

  onClickbackFn(tool: Tool): void {
    if(tool.code == 'All_Alert'){
      this.showLevel2Select = true;
    }else if(tool.code == 'Fake_Plate'){
      this.routerService.navigate([PathLib.FAKE_PLATE]);
    }
  }

  changeLevel2SelectVisibleFn(flag:boolean):void {
    this.showLevel2Select = flag;
  }

  changeDateSelectVisibleFn(flag: boolean): void {
    this.showDateSelect = flag;
  }

  changeSelectedFn(taskValue: string): void {
    this.setAlertSearch(taskValue);
    // click All Alert to close
    if (!taskValue) {
      this.changeLevel2SelectVisibleFn(false);
      this.closeAlertSearch();
    }
  }

  setParamsTimes(params: DateKey):void {
    if (params.startDate && params.endDate) {
      this.trafficSitesParams.startDateTime = params.startDate || '';
      this.trafficSitesParams.endDateTime = params.endDate || '';
      // Triggers the change event for the component
      this.trafficSitesParams = JSON.parse(JSON.stringify(this.trafficSitesParams));
      this.getAlertMapAllAlerts();
      this.getBehavioralAlertData();
    }
    this.copyTrafficSitesParams = JSON.parse(JSON.stringify(this.trafficSitesParams));
    this.alertHttpRequest.toolBoxToBusinessDateChange$.next(Object.assign(params, {activedTab: this.activedTab}));
  }

  getAlertMapAllAlerts():void {
    if (this.getAllAlertLoading) return;
    this.getAllAlertLoading = true;
    const res = this.mapHttpRequest.getCountAlertBySiteCode(this.trafficSitesParams);
    res.pipe(
      tap({
        error: () => {
          this.alertLocations = [];
        },
      }),
      finalize(() => {
        this.getAllAlertLoading = false;
        this.mapService.subject.next({
          eventType: 'set-alert-map-alert-markers',
          data: {alertLocations: this.alertLocations},
        });
      }),
    ).subscribe((data:AllAlertsSearchRes) => {
      if (data.status === 200) {
        this.alertLocations = data.result;
      } else {
        this.alertLocations = [];
      }
    });
  }

  setDefaultDate(alertType: string): void {
    if (['watchList', 'behavioral', 'geofenceList', 'noNumberPlate'].includes(alertType)) {
      this.defaultDate = {
        startDate: dayjs().subtract(6, 'days').startOf("day"),
        endDate: dayjs().subtract(0, 'days').endOf('day'),
      };
      return;
    }
    if (this.copyTrafficSitesParams?.startDateTime && this.copyTrafficSitesParams?.endDateTime) {
      this.defaultDate = {
        startDate: dayjs(this.copyTrafficSitesParams.startDateTime),
        endDate: dayjs(this.copyTrafficSitesParams.endDateTime),
      };
    } else {
      this.defaultDate = {
        startDate: dayjs().startOf("day"),
        endDate: dayjs().endOf('day'),
      };
    }
  }

  setAlertSearch(alertType:string, isJump = ''): void {
    this.setDefaultDate(alertType);
    if (alertType) {
      this.hiddenAlertSearch = false;
      const params = sessionStorage.getItem('homeToAlertParams');
      // home entered
      if (params) {
        const homeToAlertParams = JSON.parse(params);
        this.selectedList = homeToAlertParams.sites || [];
        this.trafficSitesParams = homeToAlertParams;
        this.defaultDate = {
          startDate: dayjs(homeToAlertParams.startDateTime),
          endDate: dayjs(homeToAlertParams.endDateTime),
        };
        sessionStorage.removeItem('homeToAlertParams');
      } else if (isJump === 'jump') { // alert entered
        this.defaultDate = {
          startDate: dayjs(this.trafficSitesParams.startDateTime),
          endDate: dayjs(this.trafficSitesParams.endDateTime),
        };
      }
    } else {
      this.hiddenAlertSearch = true;
    }

    this.initSearch(this.defaultDate);
    this.activedTab = alertType;
    this.globalSubscriptionService.pointerEventsChange$.next(this.activedTab);
    this.selectedLabel = this.selectOptions.filter(item => alertType === item.value)[0].label;
    this.toolSet[0].value = this.selectedLabel;
  }

  closeAlertSearch():void {
    this.setAlertSearch('');
    this.mapService.subject.next({
      eventType: 'set-alert-map-marker-details-close',
      data: {},
    });
  }

  setShowBigBehavioralAlert(flag: boolean, type = 'immediate'):void {
    this.clearShowTimer();
    if (type === 'immediate') {
      this.showBigBehavioralAlert = flag;
    } else if (type === 'delay') {
      this.showTimer = window.setTimeout(() => {
        this.showBigBehavioralAlert = flag;
      }, 600);
    }
  }

  getBehavioralAlertData():void {
    if (this.behavioralAlertLoading) return;
    this.loadingService.startLoader('behavioral-alert-map-loader');
    this.behavioralAlertLoading = true;
    const params = {
      startDateTime: this.trafficSitesParams.startDateTime,
      endDateTime: this.trafficSitesParams.endDateTime,
      sites: this.trafficSitesParams.sites,
    };
    const res = this.homeHttpRequest.postBehavioralAlertApi(params);
    res.pipe(
      finalize(() => {
        this.behavioralAlertLoading = false;
        this.loadingService.stopLoader('behavioral-alert-map-loader');
      }),
    ).subscribe((data:BehavioralAlertsStatisticsRes) => {
      if (data.status === 200) {
        this.behavioralAlertChartOption = data.result || [];
      }
    });

    const resByTime = this.homeHttpRequest.postBehavioralAlertByTimeApi(params);
    resByTime.pipe(
    ).subscribe((data:BehavioralAlertsStatisticsByTimeRes) => {
      if (data.status === 200) {
        this.behavioralAlertLineChartOption = data.result || [];
      }
    });
  }

  clearShowTimer():void {
    if (this.showTimer) {
      window.clearTimeout(this.showTimer);
    }
  }

  addNewTask(type:string):void {
    this.showNewTask = true;
    this.newTaskType = type;
  }

  // Jump to '/ai-all-task' page
  viewAllTask(params:object):void {
    this.routerService.navigate([PathLib.TASK_MANAGEMENT], {queryParams: params});
  }

  closeNewTask():void {
    this.showNewTask = false;
  }

  saveSucEvent(event: boolean): void {
    if (event) this.showNewTask = false;
  // do some thing ...
  }

  openAlertDetail(data: WatchlistAlert | BehavioralAlert | GeofenceAlert):void {
    this.showAlertPointDetail = true;
    this.alertId = data.id || data.alertId || '';
    this.cameraId = data.cameraId || '';
  }

  openAlertTableModal(data: WatchlistAlert | BehavioralAlert | GeofenceAlert | OutNoNumberPlateList): void {
    this.showAlertTableModal = true;
    this.currentTableData = data;
  }

  closeDetail():void {
    this.showAlertPointDetail = false;
    this.showAlertTableModal = false;
  }

  setDetailAlertPosition(flag:string):void {
    this.detailAlertPosition = flag;
  }

  setDetailAlertType(flag:string):void {
    this.detailAlertType = flag;
  }
  /* custom function   -----end */
}
