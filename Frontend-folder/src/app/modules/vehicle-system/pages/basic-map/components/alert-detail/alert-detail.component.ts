import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { tap } from 'rxjs';
import { MessageService } from 'src/app/modules/vehicle-system/services/common/message.service';
import { DIRECTION, I18nService } from 'src/app/modules/vehicle-system/utils/i18n.service';
import {
  CameraInfo,
  CameraInfoRes,
  LatestAlert,
  LatestAlertRes,
  LatestCapture,
  LatestCaptureRes,
} from '../../../../interfaces/basic-map/http.response';
import { CodesArrayItem, KeyValueType } from '../../../../interfaces/key-value-type';
import { MapHttpRequest } from '../../../../services/basic-map/http.service';
import { CodeItemService } from '../../../../services/global-subscription.service';
import { MapService } from '../../../../services/map-event.service';

@Component({
  selector: 'vs-alert-detail',
  templateUrl: './alert-detail.component.html',
  styleUrls: ['./alert-detail.component.scss'],
})
export class AlertDetailComponent implements OnChanges, OnInit {
  @Input() cameraId='';
  @Input() alertId='';
  @Input() alertPosition='';
  @Input() alertType:string | undefined;
  @Output() colse: EventEmitter<boolean> = new EventEmitter<boolean>();

  language!: string;
  plateColorMap: KeyValueType={};
  vehicleBrandTypeMap: KeyValueType={};
  vehicleTypeMap: KeyValueType={};
  vehicleColorMap: KeyValueType={};
  cameraTypeMap: KeyValueType={};
  cameraSourceMap: KeyValueType={};
  activeDetailTab='camera-information';
  isPlayVideo=false;
  isPlayVideoRecord = false;
  showVideoType: 'live-stream' | 'history-stream' = 'history-stream';
  slideX = "100%";

  cameraInfo:CameraInfo={
    cameraName: '',
    cameraId: '',
    cameraCode: '',
    cameraStatus: '',
    cameraSource: '',
    latitude: '',
    siteName: '',
    longitude: '',
    cameraType: '',
    laneId: '',
    laneNo: '',
    deviceType: '',
  };

  latestAlert:LatestAlert= {
    captureImageUrl: '',
    captureDate: '',
    captureTime: '',
    vehicleMake: '',
    plateColor: '',
    vehicleSpeed: '',
    vehicleColor: '',
    vehicleType: '',
    vehicleModel: '',
    vehicleImage: '',
    country: '',
    alertId: '',
    id: '',
    plateImageUrl: '',
    alertType: '',
    plateImage: '',
    leftTopX: 0,
    leftTopY: 0,
    rightBtmX: 0,
    rightBtmY: 0,
  };

  latestCapture:LatestCapture= {
    captureDate: '',
    captureTime: '',
    vehicleMake: '',
    plateColor: '',
    vehicleSpeed: '',
    vehicleColor: '',
    country: '',
    vehicleType: '',
    vehicleModel: '',
    captureImageUrl: '',
    plateImageUrl: '',
    alertId: '',
  };

  m3u8Video = 'https://tv.cdn.xsg.ge/gpb-2tv/index.m3u8';

  constructor(
    protected mapService: MapService,
    protected codeItemService: CodeItemService,
    protected tl: TranslocoService,
    protected mapHttpRequest: MapHttpRequest,
    protected loadingService: NgxUiLoaderService,
    protected messageService: MessageService,
    protected i18nService: I18nService,
  ) {
    const enableRtl = i18nService.getDirection() === DIRECTION.RTL;
    if(enableRtl) {
      this.slideX = "-100%";
    }
  }


  /* Lifecycle function  -----start */
  ngOnInit(): void {
    this.language = this.tl.getActiveLang();
    this.initSelectItemData();
  }

  ngOnChanges(): void {
    const cameraParams = {cameraCode: this.cameraId};
    const cameraRes = this.mapHttpRequest.getCameraInfoApi(cameraParams);
    cameraRes.pipe(
      tap({
        error: () => {
          this.resetCameraInfo();
        },
      }),
    ).subscribe((data:CameraInfoRes) => {
      if (data.status === 200) {
        if(data.result && JSON.stringify(data.result) !== '{}') {
          this.cameraInfo = data.result;
        }
      } else {
        this.resetCameraInfo();
      }
    });

    if (this.alertType) {
      const alertParams = {
        alertType: this.alertType,
        cameraCode: this.cameraId,
        alertId: this.alertId,
      };
      const captureRes = this.mapHttpRequest.getLatestAlertApi(alertParams);
      captureRes.pipe(
        tap({
          error: () => {
            this.resetLatestAlert();
          },
        }),
      ).subscribe((data:LatestAlertRes) => {
        if (data.status === 200 && data.result) {
          this.latestAlert = data.result;
        } else {
          this.resetLatestAlert();
        }
      });
    } else {
      const cameraRes = this.mapHttpRequest.getLatestCaptureApi(this.cameraId);
      cameraRes.pipe(
        tap({
          error: () => {
            this.resetLatestCapture();
          },
        }),
      ).subscribe((data:LatestCaptureRes) => {
        if (data.status === 200 && data.result) {
          this.latestCapture = data.result;
        } else {
          this.resetLatestCapture();
        }
      });
    }

  }
  /* Lifecycle function  -----end */


  /* custom function   -----start */
  initSelectItemData():void {
    this.codeItemService.subject$.subscribe(({eventType, data}) => {
      if (eventType === 'update-codeItems') {
        data.forEach(item => {
          switch(item.codeType) {
            case 'LprPlateColor':
              this.setPlateColorMap(item.codesArray);
              break;
            case 'LprVehicleBrandType':
              this.setVehicleBrandTypeMap(item.codesArray);
              break;
            case 'LprVehicleType':
              this.setVehicleTypeMap(item.codesArray);
              break;
            case 'LprVehicleColor':
              this.setVehicleColorMap(item.codesArray);
              break;
            case 'LprCameraSource':
              this.setCameraSourceMap(item.codesArray);
              break;
            case 'LprCameraType':
              this.setCameraTypeMap(item.codesArray);
              break;
          }
        });
      }
    });
  }

  setPlateColorMap(list:Array<CodesArrayItem>):void {
    list.forEach(item => {
      this.plateColorMap[item.codeItemValue] = this.getItemName(item);
    });
  }

  setVehicleBrandTypeMap(list:Array<CodesArrayItem>):void {
    list.forEach(item => {
      this.vehicleBrandTypeMap[item.codeItemValue] = this.getItemName(item);
    });
  }

  setVehicleTypeMap(list:Array<CodesArrayItem>):void {
    list.forEach(item => {
      this.vehicleTypeMap[item.codeItemValue] = this.getItemName(item);
    });
  }

  setVehicleColorMap(list:Array<CodesArrayItem>):void {
    list.forEach(item => {
      this.vehicleColorMap[item.codeItemValue] = this.getItemName(item);
    });
  }

  setCameraSourceMap(list:Array<CodesArrayItem>):void {
    list.forEach(item => {
      this.cameraSourceMap[item.codeItemValue] = this.getItemName(item);
    });
  }

  setCameraTypeMap(list:Array<CodesArrayItem>):void {
    list.forEach(item => {
      this.cameraTypeMap[item.codeItemValue] = this.getItemName(item);
    });
  }

  getItemName(data: CodesArrayItem, flag?:string):string {
    const language = flag || this.language;
    if (language === 'en') {
      return data.englishItemName;
    } else if (language === 'ar') {
      return data.arabItemName;
    }
    return '';
  }

  resetCameraInfo():void {
    this.cameraInfo = {
      cameraName: '',
      cameraId: '',
      cameraCode: '',
      cameraStatus: '',
      cameraSource: '',
      latitude: '',
      siteName: '',
      longitude: '',
      cameraType: '',
      laneId: '',
      laneNo: '',
      deviceType: '',
    };
  }

  resetLatestAlert():void {
    this.latestAlert = {
      captureImageUrl: '',
      captureDate: '',
      captureTime: '',
      vehicleMake: '',
      plateColor: '',
      vehicleSpeed: '',
      vehicleColor: '',
      vehicleType: '',
      vehicleModel: '',
      vehicleImage: '',
      country: '',
      alertId: '',
      id: '',
      plateImageUrl: '',
      alertType: '',
      plateImage: '',
      leftTopX: 0,
      leftTopY: 0,
      rightBtmX: 0,
      rightBtmY: 0,
    };
  }

  resetLatestCapture():void {
    this.latestCapture = {
      captureDate: '',
      captureTime: '',
      vehicleMake: '',
      plateColor: '',
      vehicleSpeed: '',
      vehicleColor: '',
      country: '',
      vehicleType: '',
      vehicleModel: '',
      captureImageUrl: '',
      plateImageUrl: '',
      alertId: '',
    };
  }

  playLiveVideo():void {
    this.showVideoType = 'live-stream';
    this.isPlayVideoRecord = false;
    this.isPlayVideo = !this.isPlayVideo;
  }

  closeDetail():void {
    this.colse.emit();
  }

  setDetailTab(type:string):void {
    this.activeDetailTab = type;
  }

  setAlertSearch():void {
    this.mapService.subject.next({
      eventType: 'alert-search',
      data: {alertType: this.alertType},
    });
  }

  errTips(msg: string): void {
    msg && this.messageService.error(msg);
  }
  /* custom function   -----end */
}
