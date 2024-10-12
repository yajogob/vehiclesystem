import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import dayjs, { Dayjs } from 'dayjs/esm';
import { TimePeriod } from 'ngx-daterangepicker-material/daterangepicker.component';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { Subscription, finalize, tap } from 'rxjs';
import { SiteTreeNode } from '../../components/site-selector/interfaces/http.response';
import { Tool } from '../../components/toolbox';
import { GeofenceAlert, WatchlistAlert } from '../../interfaces/alert/http.response';
import { CameraData, QueryCamerasRes, QuerySitesRes, SiteData } from '../../interfaces/basic-map/http.response';
import { TrafficParams } from '../../interfaces/home/http.params';
import {
  BehavioralAlertData,
  BehavioralAlertLineData,
  BehavioralAlertsStatisticsByTimeRes,
  BehavioralAlertsStatisticsRes,
  GetVehicleCountRes,
  LiveTrafficData,
  StatisticsLiveTrafficRes,
} from '../../interfaces/home/http.response';
import { CustomRanges, DateKey, SelectType, customPositionType } from '../../interfaces/key-value-type';
import { AllResourceList, PathLib } from '../../libs/path-library';
import { MapHttpRequest } from '../../services/basic-map/http.service';
import { HomeHttpRequest } from '../../services/home/http.service';
import { MapService } from '../../services/map-event.service';
import { RouterService } from '../../services/router.service';
import { I18nService } from '../../utils/i18n.service';
import { LoggerService } from '../../utils/logger.service';
import { TrafficSitesComponent } from './components/traffic-sites/traffic-sites.component';

@Component({
  selector: 'vs-home-map',
  templateUrl: './home-map.component.html',
  styleUrls: ['./home-map.component.scss'],
})
export class HomeMapComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('trafficSitesObj') childTrafficSites: TrafficSitesComponent | undefined;

  language='';
  vehicleCount = 0;
  showBigLiveTraffic = false;
  showBigBehavioralAlert = false;
  showTimer = 0;
  allResourceList = AllResourceList;
  dateLimit = 29;
  ranges: CustomRanges[] = [];

  defaultDate: TimePeriod = {
    startDate: dayjs().startOf("day"),
    endDate: dayjs().endOf('day'),
  };

  trafficSitesParams:TrafficParams = {
    sites: [],
    startDateTime: '',
    endDateTime: '',
  };

  showLevel2Select=false;
  showDateSelect=false;
  selectedList: SiteTreeNode[] = [];
  toolSet: Tool[] = [];
  selectTitle='';
  selectedLabel='';
  selectOptions:Array<SelectType>=[];
  mapRenderView='sites';
  getAllCameraLoading=false;
  cameraLocations: Array<CameraData>=[];
  getAllSiteLoading=false;
  siteLocations: Array<SiteData>=[];
  showLocationFlag=false;
  showAlertPointDetail=false;
  cameraId='';
  alertId='';
  detailAlertPosition='';
  detailAlertType='';
  customPosition!: customPositionType;
  liveTrafficTimer?: number | null;
  vehicleCountTimer?: number | null;
  behavioralAlertTimer?: number | null;
  liveTrafficLoading=false;
  liveTrafficChartOption:Array<LiveTrafficData>=[];
  behavioralAlertLoading=false;
  behavioralAlertChartOption:Array<BehavioralAlertData>=[];
  behavioralAlertLineChartOption:Array<BehavioralAlertLineData>=[];


  private localeI18nValue: string[] = [];
  private localeI18nKey = [
    'vs.dateinput.today',
    'vs.dateinput.last7days',
    'vs.dateinput.last30days',
    'vs.dateinput.customRangeLabel',
  ];

  private selectTranslate$!: Subscription;

  constructor(
    private i18nService: I18nService,
    private mapService: MapService,
    private router: Router,
    private loadingService: NgxUiLoaderService,
    private tl: TranslocoService,
    private mapHttpRequest: MapHttpRequest,
    private homeHttpRequest: HomeHttpRequest,
    private logger: LoggerService,
    private translocoService: TranslocoService,
    private routerService: RouterService,
  ) {}


  /* Lifecycle function  -----start */
  ngOnInit(): void {
    this.transloco();
    this.initSubject();
    this.mapService.subject.next({
      eventType: 'set-page-on-gomap',
      data: {type: '/home'},
    });
    this.language = this.i18nService.getLanguage();
    this.i18nService.getLanguageObservable().subscribe(lang => {
      this.language = lang;
    });

    this.setCustomPosition();
    if (this.language === 'en') {
      this.toolSet = [{
        code: 'map-view',
        category: 'View',
        value: 'Sites',
        arrowIcon: true,
      }];
      this.selectTitle = 'View';
      this.selectOptions = [
        {label: 'Sites', value: 'sites'},
        {label: 'Sites Heat map', value: 'sitesHeat'},
        {label: 'Camera', value: 'camera'},
        {label: 'Camera Heat map', value: 'cameraHeat'},
      ];
    } else if (this.language === 'ar') {
      this.toolSet = [{
        code: 'map-view',
        category: 'عرض',
        value: 'مواقع',
        arrowIcon: true,
      }];
      this.selectTitle = 'عرض';
      this.selectOptions = [
        {label: 'مواقع', value: 'sites'},
        {label: 'الخريطة الحرارية', value: 'sitesHeat'},
        {label: 'الكاميرا', value: 'camera'},
        {label: 'الخريطة الحرارية للكاميرات', value: 'cameraHeat'},
      ];
    }

    this.changeSelectedFn(this.mapRenderView);
    this.initSearch(this.defaultDate);

    // After leaving "/home", clear loading on this page
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd){
        this.loadingService.destroyLoaderData('live-traffic-loader');
        this.loadingService.destroyLoaderData('behavioral-alert-loader');
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
    this.selectTranslate$ && this.selectTranslate$.unsubscribe();
  }

  /* Lifecycle function  -----end */


  /* custom function   -----start */
  private setCustomPosition(): void {
    if(this.language === 'en') {
      this.customPosition = {
        position: 'fixed',
        bottom: '-16.6rem',
        left: '2.5rem',
      };
    }
    if(this.language === 'ar') {
      this.customPosition = {
        position: 'fixed',
        bottom: '-16.6rem',
        left: '-2.5rem',
      };
    }
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

  private initSubject(): void {
    this.mapService.subject.subscribe(({eventType, data}) => {
      switch (eventType) {
        case 'set-alert-map-marker-details':
          this.setDetailAlertPosition(data.alertPosition || '');
          this.setDetailAlertType(data.alertType || '');
          if (data.watchlistDetail) {
            this.openAlertDetail(data.watchlistDetail);
          } else if (data.geofenceDetail) {
            this.openAlertDetail(data.geofenceDetail);
          }
          break;
        case 'set-alert-map-marker-details-close':
          this.closeDetail();
          break;
      }
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
      }, { [this.localeI18nValue[3]]: undefined },
    ];
  }

  private formatTime = (date: Dayjs): number => {
    if (date) {
      const localTime = `${date.year()}-${date.month() + 1}-${date.date()} ${date.hour()}:${date.minute()}:${date.second()}`;
      return new Date(localTime).getTime();
    } else {
      return 0;
    }
  };

  initSearch(range: TimePeriod):void {
    this.trafficSitesParams.startDateTime = this.formatTime(range.startDate);
    this.trafficSitesParams.endDateTime = this.formatTime(range.endDate);
    this.periodicUpdateVehicleCount();
    this.getHomeMapPointLists();
    this.periodicUpdateLiveTrafficData();
    this.periodicUpdateBehavioralAlertData();
  }

  getAllSites():void {
    if (this.getAllSiteLoading) return;
    const param= {sites: this.trafficSitesParams.sites};
    this.getAllSiteLoading = true;
    const res = this.mapHttpRequest.getAllSitesApi(param);
    res.pipe(
      tap({
        error: () => {
          this.siteLocations = [];
        },
      }),
      finalize(() => {
        this.getAllSiteLoading = false;
        this.mapService.subject.next({
          eventType: 'set-home-map-site-markers',
          data: {siteLocations: this.siteLocations},
        });
      }),
    ).subscribe((data:QuerySitesRes) => {
      if (data.status === 200) {
        this.siteLocations = data.result;
      } else {
        this.siteLocations = [];
      }
    });
  }

  getAllCameras():void {
    if (this.getAllCameraLoading) return;
    const param= {sites: this.trafficSitesParams.sites};
    this.getAllCameraLoading = true;
    const res = this.mapHttpRequest.getAllCamerasApi(param);
    res.pipe(
      tap({
        error: () => {
          this.cameraLocations = [];
        },
      }),
      finalize(() => {
        this.getAllCameraLoading = false;
        this.mapService.subject.next({
          eventType: 'set-home-map-camera-markers',
          data: {cameraLocations: this.cameraLocations},
        });
      }),
    ).subscribe((data:QueryCamerasRes) => {
      if (data.status === 200) {
        this.cameraLocations = data.result;
      } else {
        this.cameraLocations = [];
      }
    });
  }

  getHomeMapPointLists():void {
    this.getAllSites();
    this.getAllCameras();
  }

  setMapViewType():void {
    this.mapService.subject.next({
      eventType: 'set-home-map-view-type',
      data: {type: this.mapRenderView},
    });
  }

  // Hide <vs-map-controller> when location-select is visibled
  changeLocationVisible(flag: boolean):void {
    this.showLocationFlag = flag;
  }

  onDeviceTreeChange(data: SiteTreeNode[]):void {
    this.selectedList = data;
    this.trafficSitesParams.sites = data;
    // Triggers the change event for the component
    this.trafficSitesParams = JSON.parse(JSON.stringify(this.trafficSitesParams));
    this.periodicUpdateVehicleCount();
    this.getHomeMapPointLists();
    this.periodicUpdateLiveTrafficData();
    this.periodicUpdateBehavioralAlertData();
  }

  onClickbackFn(tool: Tool): void {
    if(tool.code == 'map-view'){
      this.showLevel2Select = true;
    }
  }

  changeLevel2SelectVisibleFn(flag: boolean):void {
    this.showLevel2Select = flag;
  }

  changeDateSelectVisibleFn(flag: boolean): void {
    this.showDateSelect = flag;
  }

  changeSelectedFn(taskValue: string):void {
    this.mapRenderView = taskValue;
    this.selectedLabel = this.selectOptions.filter(item => taskValue === item.value)[0].label;
    this.toolSet[0].value = this.selectedLabel;
    this.setMapViewType();
  }

  setParamsTimes(params: DateKey):void {
    if (params.startDate && params.endDate) {
      this.trafficSitesParams.startDateTime = params.startDate || '';
      this.trafficSitesParams.endDateTime = params.endDate || '';
      // Triggers the change event for the component
      this.trafficSitesParams = JSON.parse(JSON.stringify(this.trafficSitesParams));
      // time change, update data
      this.periodicUpdateVehicleCount();
      this.periodicUpdateLiveTrafficData();
      this.periodicUpdateBehavioralAlertData();
    }
  }

  periodicUpdateVehicleCount():void {
    if (this.vehicleCountTimer) {
      window.clearTimeout(this.vehicleCountTimer);
      this.vehicleCountTimer = null;
    }
    this.setVehicleCount();
  }

  setVehicleCount():void {
    // trigger a method in a component(<vs-traffic-sites></vs-traffic-sites>)
    this.childTrafficSites?.getTrafficSites();
    const res = this.homeHttpRequest.postVehicleCountApi(this.trafficSitesParams);
    res.pipe(
      tap({
        error: () => {
          this.vehicleCount = 0;
        },
      }),
      finalize(() => {
        this.vehicleCountTimer = window.setTimeout(() => {
          this.periodicUpdateVehicleCount();
        }, 300000);
      }),
    ).subscribe((data:GetVehicleCountRes) => {
      if (data.status === 200) {
        this.vehicleCount = data.result.vehicleCount;
      } else {
        this.vehicleCount = 0;
      }
    });
  }

  setAlertSearch(alertType:string): void {
    sessionStorage.setItem('homeToAlertParams', JSON.stringify(this.trafficSitesParams));
    this.routerService.navigate([PathLib.ALERT]);
    setTimeout(() => {
      this.mapService.subject.next({
        eventType: 'alert-search',
        data: {alertType},
      });
    }, 20);
  }

  goTrafficSearch():void {
    sessionStorage.setItem('homeToTrafficSearchParams', JSON.stringify(this.trafficSitesParams));
    this.routerService.navigate([PathLib.TRAFFIC_SEARCH]);
  }

  periodicUpdateLiveTrafficData():void {
    if (this.liveTrafficLoading) return;
    this.loadingService.startLoader('live-traffic-loader');
    this.liveTrafficLoading = true;
    if (this.liveTrafficTimer) {
      window.clearTimeout(this.liveTrafficTimer);
      this.liveTrafficTimer = null;
    }
    this.getLiveTrafficData();
  }

  getLiveTrafficData():void {
    const params = {
      hour: 1,
      sites: this.trafficSitesParams.sites,
      startDateTime: this.trafficSitesParams.startDateTime,
      endDateTime: this.trafficSitesParams.endDateTime,
    };
    const response = this.homeHttpRequest.postLiveTrafficApi(params);
    response.pipe(
      finalize(() => {
        this.liveTrafficLoading = false;
        this.loadingService.stopLoader('live-traffic-loader');
        this.liveTrafficTimer = window.setTimeout(() => {
          this.periodicUpdateLiveTrafficData();
        }, 300000);
      }),
    ).subscribe((data:StatisticsLiveTrafficRes) => {
      if (data.status === 200) {
        this.liveTrafficChartOption = data.result || [];
      }
    });
  }

  setShowBigLiveTraffic(flag: boolean, type = 'immediate'):void {
    this.clearShowTimer();
    this.showBigBehavioralAlert = false;
    if (type === 'immediate') {
      this.showBigLiveTraffic = flag;
    } else if (type === 'delay') {
      this.showTimer = window.setTimeout(() => {
        this.showBigLiveTraffic = flag;
      }, 600);
    }
  }

  periodicUpdateBehavioralAlertData():void {
    if (this.behavioralAlertLoading) return;
    this.loadingService.startLoader('behavioral-alert-loader');
    this.behavioralAlertLoading = true;
    if (this.behavioralAlertTimer) {
      window.clearTimeout(this.behavioralAlertTimer);
      this.behavioralAlertTimer = null;
    }
    this.getBehavioralAlertData();
  }

  getBehavioralAlertData():void {
    const params = {
      startDateTime: this.trafficSitesParams.startDateTime,
      endDateTime: this.trafficSitesParams.endDateTime,
      sites: this.trafficSitesParams.sites,
    };
    const res = this.homeHttpRequest.postBehavioralAlertApi(params);
    res.pipe(
      finalize(() => {
        this.behavioralAlertLoading = false;
        this.loadingService.stopLoader('behavioral-alert-loader');
        this.behavioralAlertTimer = window.setTimeout(() => {
          this.periodicUpdateBehavioralAlertData();
        }, 300000);
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

  setShowBigBehavioralAlert(flag: boolean, type = 'immediate'):void {
    this.clearShowTimer();
    this.showBigLiveTraffic = false;
    if (type === 'immediate') {
      this.showBigBehavioralAlert = flag;
    } else if (type === 'delay') {
      this.showTimer = window.setTimeout(() => {
        this.showBigBehavioralAlert = flag;
      }, 600);
    }
  }

  clearShowTimer():void {
    if (this.showTimer) {
      window.clearTimeout(this.showTimer);
    }
  }

  setDetailAlertPosition(flag:string):void {
    this.detailAlertPosition = flag;
  }

  setDetailAlertType(flag:string):void {
    this.detailAlertType = flag;
  }

  openAlertDetail(data: WatchlistAlert | GeofenceAlert):void {
    this.showAlertPointDetail = true;
    this.alertId = data.id || '';
    this.cameraId = data.cameraId || '';
  }

  closeDetail():void {
    this.showAlertPointDetail = false;
  }
  /* custom function   -----end */
}
