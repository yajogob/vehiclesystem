import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { tap } from 'rxjs';
import { CameraInfo, LatestCapture, LatestCaptureRes } from '../../interfaces/basic-map/http.response';
import { KeyValueType } from '../../interfaces/key-value-type';
import { MapHttpRequest } from '../../services/basic-map/http.service';
import { CodeItemService } from '../../services/global-subscription.service';
import { DIRECTION, I18nService } from '../../utils/i18n.service';

@Component({
  selector: 'vs-camera-details-side',
  templateUrl: './camera-details-side.component.html',
  styleUrls: ['./camera-details-side.component.scss'],
  animations: [
    trigger('slideTrigger', [
      transition(':enter', [
        style({ transform: 'translateX({{tx}})' }),
        animate('200ms ease-in-out', style({ transform: 'translateX(0)' })),
      ], {params: {tx: '100%'}}),
      transition(':leave', [
        animate('200ms ease-in-out', style({ transform: 'translateX({{tx}})' })),
      ], {params: {tx: '100%'}}),
    ]),
  ],
})
export class CameraDetailsSideComponent implements OnInit, OnChanges {
  @Input() isShowDetails = false;
  @Input() cameraInfo?:CameraInfo;
  @Input() vehicleBrandTypeMap?:KeyValueType;
  @Input() plateColorMap?:KeyValueType;
  @Input() vehicleTypeMap?:KeyValueType;
  @Input() vehicleColorMap?:KeyValueType;
  @Input() cameraSourceMap?:KeyValueType;
  @Output() closeEmit = new EventEmitter<null>();

  slideX = "100%";
  language = 'en';
  activeDetailTab = 'camera-information';
  showVideoType: 'live-stream' | 'history-stream' = 'history-stream';
  isPlayVideo=false;
  bigImageUrl = '';
  isShowBigImg = false;
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

  isGpuAnalysisMap: KeyValueType = {
    '1en': 'Ongoing',
    '1ar': 'جاري',
    '0en': 'None',
    '0ar': 'لا شيء',
  };

  m3u8Video = 'https://tv.cdn.xsg.ge/gpb-2tv/index.m3u8';

  constructor(
    protected codeItemService: CodeItemService,
    protected mapHttpRequest: MapHttpRequest,
    protected i18nService: I18nService,
    protected tl: TranslocoService,
  ) {
    const enableRtl = i18nService.getDirection() === DIRECTION.RTL;
    if(enableRtl) {
      this.slideX = "-100%";
    }
  }

  /* Lifecycle function  -----start */
  ngOnInit(): void {
    this.language = this.tl.getActiveLang();
    document.addEventListener('keyup', this.closeFullImageByEsc);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cameraInfo']) {
      if (this.cameraInfo?.cameraId) {
        const cameraRes = this.mapHttpRequest.getLatestCaptureApi(this.cameraInfo.cameraId);
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
  }
  /* Lifecycle function  -----end */


  /* custom function   -----start */
  closeFullImageByEsc = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.isShowBigImg = false;
    }
  };

  closeDetail():void {
    this.closeEmit.emit();
  }

  setDetailTab(tab: string): void {
    this.activeDetailTab = tab;
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
    this.isPlayVideo = !this.isPlayVideo;
  }

  checkBigImage(url:string): void {
    if (url) {
      this.bigImageUrl = url;
      this.isShowBigImg = true;
    }
  }
  /* custom function   -----end */
}
