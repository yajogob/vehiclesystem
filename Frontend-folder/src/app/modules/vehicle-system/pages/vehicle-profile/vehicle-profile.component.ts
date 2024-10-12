import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { DEFAULT_MAP_OPTION } from '@config';
import { TranslocoService } from "@ngneat/transloco";
import dayjs from 'dayjs/esm';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { finalize } from 'rxjs';
import { Tool } from "../../components/toolbox";
import { KeyValueType, SelectType, customPositionType } from '../../interfaces/key-value-type';
import {
  GetVehicleProfileListParams,
  VehiclePlateRecordResult,
  VehicleProfile,
  VehicleProfileCountMap,
  VehicleProfileListParams,
  VehicleProfileListResponse,
  VehicleProfileTimeLineParams,
  VehicleProfileTimeLineResult,
  VehicleProfileTimeLineResultValue,
} from '../../interfaces/vehicle-profile/vehicle-profile';
import { NotPartOfTheUAE, PathLib } from '../../libs/path-library';
import { MapService } from "../../services/map-event.service";
import { VehicleProfileService } from '../../services/vehicle-profile/vehicle-profile.service';

@Component({
  selector: 'vs-vehicle-profile',
  templateUrl: './vehicle-profile.component.html',
  styleUrls: ['./vehicle-profile.component.scss'],
})
export class VehicleProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  trafficSearchEnter = false;
  vehicleProfileList: Array<VehicleProfile> = [];
  vehicleProfileDetails!: VehicleProfile;
  isShowVpDetails!: boolean;
  isShowTimeLine!: boolean;
  isShowTimeLineSwitch = false;
  isShowBackButton!: boolean;
  activeIndex!: number;
  timeLineDetailsList: VehicleProfileTimeLineResult[] = [];
  vehiclePassDeviceCountMap:VehicleProfileCountMap = {};
  vehiclePlateRecordResult: VehiclePlateRecordResult = {};
  vehiclePlateRecords: string[] = [];
  selectedPlate = '';
  selectedImg = '';
  vehicleProfileTrackers: Array<VehicleProfileTimeLineResultValue>= [];
  plateColorList: KeyValueType[] = [];
  vehicleMakeModelColorList: KeyValueType[] = [];
  vehicleTypeList: KeyValueType[] = [];
  currentLanguage = 'en';
  toolSet: Tool[] = [];
  mapRenderView='Track';
  showLevel2Select=false;
  selectTitle='';
  selectedLabel='';
  selectOptions:Array<SelectType>=[];
  isShowTrack = true;
  trafficSearchEnterShowArrow = false;
  customPosition!: customPositionType;
  isSearched = false;
  private vehicleProfileSearchParams!: VehicleProfileListParams;

  constructor(
    private router: Router,
    private vehicleProfileService: VehicleProfileService,
    private loadingService: NgxUiLoaderService,
    private translocoService: TranslocoService,
    private mapService: MapService,
  ) {}

  ngOnInit(): void {
    this.isSearched = false;
    this.selectedImg = 'assets/vehicle-system/icons/vehicle-profile-icon/tick-circle.png';
    this.currentLanguage = this.translocoService.getActiveLang();
    this.mapService.subject.next({
      eventType: 'set-page-on-gomap',
      data: {type: '/vehicle-profile', defaultZoom: 9, center: DEFAULT_MAP_OPTION.vehicleProfileCenter},
    });
    this.setCustomPosition();

    if (this.currentLanguage === 'en') {
      this.toolSet = [{
        code: 'map-view',
        category: 'View',
        value: 'Track',
        arrowIcon: true,
      }];
      this.selectTitle = 'View';
      this.selectOptions = [
        {label: 'Track', value: 'Track'},
        {label: 'Appearances', value: 'Appearances'},
      ];
    } else if (this.currentLanguage === 'ar') {
      this.toolSet = [{
        code: 'map-view',
        category: 'منظر',
        value: 'المواقع',
        arrowIcon: true,
      }];
      this.selectTitle = 'منظر';
      this.selectOptions = [
        {label: 'رأي .', value: 'Track'},
        {label: 'مظهر', value: 'Appearances'},
      ];
    }
    this.changeSelectedFn(this.mapRenderView);
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
    this.taskDestroyLoading();

    const arr = ['set-vehicleProfile-map-site-trackers', 'vehicleProfile-map-appearance'];
    arr.forEach(item => {
      this.mapService.subject.next({
        eventType: item,
        data: {vehicleProfileTrackers: [], vehicleProfileAppearance: {}},
      });
    });
  }

  /* -------------------  methods ------------------- */
  private setCustomPosition(): void {
    if(this.currentLanguage === 'en') {
      this.customPosition = {
        position: 'fixed',
        bottom: '-16.6rem',
        left: '-5rem',
      };
    }
    if(this.currentLanguage === 'ar') {
      this.customPosition = {
        position: 'fixed',
        bottom: '-16.6rem',
        left: '22rem',
      };
    }
  }

  getVehicleProfileListEmit(event: GetVehicleProfileListParams): void {
    this.vehicleProfileList = [];
    this.setTimeLineDetailsList([]);
    this.getAllOpenedDetailsList();
    this.taskShowLoading();
    switch (event.type) {
      case 'search':
        this.trafficSearchEnter = event.trafficSearchEnter;
        if (typeof event.data === 'object') this.vehicleProfileSearchParams = event.data;
        this.resetActiveIndex();
        break;
      case 'page':
        typeof event.data === 'number' && (this.vehicleProfileSearchParams.pageNo = event.data);
        break;
    }
    const paramsVehicleProfile = JSON.parse(JSON.stringify(this.vehicleProfileSearchParams));
    delete paramsVehicleProfile.pageNo;
    delete paramsVehicleProfile.pageSize;

    if (NotPartOfTheUAE.includes(this.vehicleProfileSearchParams.region)) {
      this.getVehicleProfileTimeLineList(paramsVehicleProfile);
      return;
    }

    this.isSearched = false;
    this.vehicleProfileService.getVehicleProfileList(this.vehicleProfileSearchParams).pipe(
      finalize(() => {
        this.taskHideLoading();
        this.isSearched = true;
      }),
    ).subscribe((data: VehicleProfileListResponse) => {
      if (data?.result && Object.keys(data.result).length > 0) {
        if(data.result.content.length > 0) {
          this.vehicleProfileList = data.result.content.map((item: VehicleProfile) => {
            item.vehicleMakeModel.certificateDate =
              item.vehicleMakeModel.certificateDate ? dayjs(item.vehicleMakeModel.certificateDate).format('MMM D, YYYY h:mm A') : '';
            item.vehicleRegInfo.registrationDate =
              item.vehicleRegInfo.registrationDate ? dayjs(item.vehicleRegInfo.registrationDate).format('MMM D, YYYY h:mm A') : '';
            item.vehicleRegInfo.registrationRenewDate =
              item.vehicleRegInfo.registrationRenewDate ? dayjs(item.vehicleRegInfo.registrationRenewDate).format('MMM D, YYYY h:mm A') : '';
            item.vehicleRegInfo.registrationExpiryDate =
              item.vehicleRegInfo.registrationExpiryDate ? dayjs(item.vehicleRegInfo.registrationExpiryDate).format('MMM D, YYYY h:mm A') : '';
            item.insuranceDetails.insuranceDate =
              item.insuranceDetails.insuranceDate ? dayjs(item.insuranceDetails.insuranceDate).format('MMM D, YYYY h:mm A') : '';
            item.insuranceDetails.insuranceExpiryDate =
              item.insuranceDetails.insuranceExpiryDate ? dayjs(item.insuranceDetails.insuranceExpiryDate).format('MMM D, YYYY h:mm A') : '';
            item.vehicleMakeModel.color =
              (this.vehicleMakeModelColorList.find(color => color['value'] === item.vehicleMakeModel.color)?.['key']) as string;
            item.vehicleMakeModel.type =
              (this.vehicleTypeList.find(type => type['value'] === item.vehicleMakeModel.type)?.['key']) as string;
            return item;
          });
          return;
        }
      }
      this.getVehicleProfileTimeLineList(paramsVehicleProfile);
    });
  }

  getVehicleProfileTimeLineList(event: VehicleProfileTimeLineParams, removePlateFilter=false): void {
    this.isShowTimeLineSwitch = false;
    this.isShowTimeLine = false;
    this.trafficSearchEnterShowArrow = false;
    this.timeLineDetailsList = [];
    this.vehiclePlateRecordResult = {};
    this.vehiclePlateRecords = [];
    this.isSearched = false;
    this.vehicleProfileService.getVehicleProfileTimeLineList(event).pipe(
      finalize(() => {
        this.taskHideLoading();
        this.isSearched = true;
      }),
    ).subscribe(res => {
      if (res.status !== 200) return;
      if (res?.result) {
        if (removePlateFilter) {
          const result: VehicleProfileTimeLineResult[] = [];
          Object.values(res.result).forEach(value => {
            result.push(...value);
          });
          this.setTimeLineDetailsList(result);
        } else {
          this.vehiclePlateRecordResult = res.result;
          this.vehiclePlateRecords = Object.keys(this.vehiclePlateRecordResult);
        }
      }
    });
  }

  changeSelectedPlate(plate: string):void {
    this.selectedPlate = plate;
    const result = this.vehiclePlateRecordResult[plate];
    this.setTimeLineDetailsList(result);
  }

  setTimeLineDetailsList(result: VehicleProfileTimeLineResult[]):void {
    this.vehiclePassDeviceCountMap = {};
    this.timeLineDetailsList = result.map((item: VehicleProfileTimeLineResult) => {
      item.open = '0';
      item.value = item.value.map((it: VehicleProfileTimeLineResultValue) => {
        if (this.vehiclePassDeviceCountMap[it.deviceId] === undefined) {
          this.vehiclePassDeviceCountMap[it.deviceId] = {
            count: 1,
            latitude: it.latitude,
            longitude: it.longitude,
            cameraType: it.cameraType,
          };
        } else {
          this.vehiclePassDeviceCountMap[it.deviceId].count += 1;
        }

        it.captureTimeFormat = it.captureTime ? new Date(it.captureTime).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }) : '';
        return it;
      });
      return item;
    });
    if (this.timeLineDetailsList.length > 0) this.timeLineDetailsList[0].open = '1';
    this.isShowTimeLineSwitch = this.timeLineDetailsList.length > 0;
    this.isShowTimeLine = this.timeLineDetailsList.length > 0;
    if(!this.vehicleProfileList.length && this.timeLineDetailsList.length > 0) {
      this.trafficSearchEnterShowArrow = true;
    }
    this.getAllOpenedDetailsList();
  }

  changeDetailsStateEmit(): void {
    if (this.isShowVpDetails) {
      this.isShowVpDetails = false;
      this.isShowTimeLine = false;
    } else {
      this.isShowVpDetails = true;
    }
  }

  changeTimeLineStateEmit(): void {
    this.isShowTimeLine = !this.isShowTimeLine;
  }

  resetSearchFn(): void {
    this.mapService.subject.next({
      eventType: 'set-page-on-gomap',
      data: {type: '/vehicle-profile', defaultZoom: 9, center: DEFAULT_MAP_OPTION.vehicleProfileCenter},
    });
    this.setTimeLineDetailsList([]);
    this.getAllOpenedDetailsList();
  }

  toTrafficFineEmit(data: VehicleProfile) : void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        region: data.region,
        plateCategory: data.plateCategory,
        plateNumber: data.plateNumber,
        plateColor: this.vehicleProfileSearchParams.plateColor,
        startDateTime: this.vehicleProfileSearchParams.startDateTime,
        endDateTime: this.vehicleProfileSearchParams.endDateTime,
      },
    };
    this.router.navigate([PathLib.TRAFFIC_FINE], navigationExtras);
  }

  routeTrafficSearch(): void {
    this.router.navigate([PathLib.TRAFFIC_SEARCH]);
  }

  toggleBackButtonEmit(event: boolean): void {
    this.isShowBackButton = event;
  }

  handleCheckedEmit(event: { index: number, data: VehicleProfile }): void {
    if (this.activeIndex !== event.index) {
      this.activeIndex = event.index;
      this.vehicleProfileDetails = event.data;
      this.isShowVpDetails = true;
      const paramsVehicleProfile = JSON.parse(JSON.stringify(this.vehicleProfileSearchParams));
      paramsVehicleProfile.plateNumber = event.data.plateNumber;
      paramsVehicleProfile.plateCategory = event.data.plateCategory;
      paramsVehicleProfile.region = event.data.region;
      delete paramsVehicleProfile.pageNo;
      delete paramsVehicleProfile.pageSize;
      this.getVehicleProfileTimeLineList(paramsVehicleProfile, true);
      this.getAllOpenedDetailsList();
    } else {
      // this.resetActiveIndex();
    }
  }

  checkItemEmit(event: number): void {
    this.timeLineDetailsList[event].open = this.timeLineDetailsList[event].open === '0' ? '1' : '0';
    this.getAllOpenedDetailsList();
  }

  getAllOpenedDetailsList():void {
    const vehicleProfileTrackers = this.getTimeLineDetailsListOpenItem();
    this.vehicleProfileTrackers = vehicleProfileTrackers;
    this.mapService.subject.next({
      eventType: 'set-vehicleProfile-map-site-trackers',
      data: {vehicleProfileTrackers},
    });
  }

  getDataFromSideVpSearchComponentEmit(event: {
    type: string;
    data: KeyValueType[]
  }): void {
    if (event.type === 'plateColor') this.plateColorList = event.data;
    if (event.type === 'vehicleColor') this.vehicleMakeModelColorList = event.data;
    if (event.type === 'vehicleType') this.vehicleTypeList = event.data;
  }

  onClickbackFn(tool: Tool): void {
    if(tool.code == 'map-view'){
      this.showLevel2Select = true;
    }
  }

  changeLevel2SelectVisibleFn(flag: boolean):void {
    this.showLevel2Select = flag;
  }

  changeSelectedFn(taskValue: string):void {
    this.mapRenderView = taskValue;
    this.selectedLabel = this.selectOptions.filter(item => taskValue === item.value)[0].label;
    this.toolSet[0].value = this.selectedLabel;
    this.setMapViewType();
  }

  setMapViewType():void {
    this.isShowTrack = this.mapRenderView === 'Track';
    const eventType = this.isShowTrack ? 'vehicleProfile-map-track' : 'vehicleProfile-map-appearance';
    const vehicleProfileTrackers = this.getTimeLineDetailsListOpenItem();

    if (eventType === 'vehicleProfile-map-track') {
      this.mapService.subject.next({eventType, data: {vehicleProfileTrackers}});
    } else {
      this.mapService.subject.next({eventType, data: {vehicleProfileAppearance: this.vehiclePassDeviceCountMap}});
    }
  }

  /* --------------------------- private methods --------------------------- */
  private getTimeLineDetailsListOpenItem(): Array<VehicleProfileTimeLineResultValue> {
    const vehicleProfileTrackers: Array<VehicleProfileTimeLineResultValue> = [];
    this.timeLineDetailsList.forEach(list => {
      if (list.open === '1') {
        vehicleProfileTrackers.push(...list.value);
      }
    });
    vehicleProfileTrackers.sort((a,b) => {
      return Number(a.captureTime) - Number(b.captureTime);
    });
    return vehicleProfileTrackers;
  }

  private resetActiveIndex(): void {
    this.isShowVpDetails = false;
    this.isShowTimeLine = false;
    this.activeIndex = -1;
    this.vehicleProfileList = [];
    this.vehiclePlateRecordResult = {};
    this.vehiclePlateRecords = [];
    this.selectedPlate = '';
  }

  // show loading
  private taskShowLoading(): void {
    this.loadingService.startLoader('loader-vp');
  }

  // hide loading
  private taskHideLoading(): void {
    this.loadingService.stopLoader('loader-vp');
  }

  // destroy loading
  private taskDestroyLoading(): void {
    this.loadingService.destroyLoaderData('loader-vp');
  }
}
