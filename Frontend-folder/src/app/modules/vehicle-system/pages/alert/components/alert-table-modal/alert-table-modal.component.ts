import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs';
import { OutNoNumberPlateList } from 'src/app/modules/vehicle-system/interfaces/alert/http.params';
import { BehavioralAlert, GeofenceAlert, WatchlistAlert } from 'src/app/modules/vehicle-system/interfaces/alert/http.response';
import { LatestAlert } from 'src/app/modules/vehicle-system/interfaces/basic-map/http.response';
import { AlertDetailComponent } from '../../../basic-map/components/alert-detail/alert-detail.component';

@Component({
  selector: 'vs-alert-table-modal',
  templateUrl: './alert-table-modal.component.html',
  styleUrls: ['./alert-table-modal.component.scss'],
  animations: [
    trigger('slideTrigger', [
      transition(':enter', [
        style({ transform: 'translateX({{tx}})' }),
        animate('200ms ease-in-out', style({ transform: 'translateX(0)' })),
      ], {params: {tx: '100%'}}),
      transition(':leave', [
        animate('200ms ease-in-out', style({ transform: 'translateX({{tx}})' })),
      ], {params: {tx: '100%'}}),
    ])],
})
export class AlertTableModalComponent extends AlertDetailComponent implements OnInit, OnChanges {
  @Input() currentTableData!: WatchlistAlert | GeofenceAlert | OutNoNumberPlateList | BehavioralAlert;
  @Input() showAlertTableModal = false;
  @Input() override language = 'en';
  @ViewChild('originTargetImage') ImageContainerRef: ElementRef | undefined;
  @ViewChild('bigOriginTargetImage') BigImageContainerRef: ElementRef | undefined;

  override activeDetailTab='alert';
  liveStreamUrl = '';
  historyStreamUrl = '';
  checkBigImage=false;
  checkCameraVideo = false;

  targetBox = {
    'width': 0,
    'height': 0,
    'top': 0,
    'left': 0,
    'opacity': 0,
  };

  originImageObject = {
    autoKey: '',
    originalWidth: 0,
    originalHeight: 0,
  };

  bigTargetBox = {
    'width': 0,
    'height': 0,
    'top': 0,
    'left': 0,
    'opacity': 0,
  };

  bigOriginImageObject = {
    autoKey: '',
    originalWidth: 0,
    originalHeight: 0,
  };

  override ngOnInit(): void {
    window.addEventListener('resize', this.redrawTargetBox.bind(this));
    document.addEventListener('keyup', this.closeFullImageByEsc);
    this.initSelectItemData();
  }

  override ngOnChanges(): void {
    if (this.showAlertTableModal) {
      this.activeDetailTab = 'alert';
      this.getCameraInfoByCameraCode();
      if (this.alertType === 'Behavioral' || this.alertType === 'NoNumberPlate') {
        this.latestAlert = JSON.parse(JSON.stringify(this.currentTableData));
      } else {
        this.getLatestAlertInfo();
      }

      if (this.alertType === 'Behavioral') {
        this.setAlertTargetBox('small');
      }
    } else {
      this.resetLatestAlert();
      this.resetCameraInfo();
    }
  }


  override closeDetail(): void {
    this.colse.emit();
    this.resetTargetBox();
  }

  resetTargetBox(): void {
    this.targetBox = {
      'width': 0,
      'height': 0,
      'top': 0,
      'left': 0,
      'opacity': 0,
    };
  }

  resetBigTargetBox(): void {
    this.bigTargetBox = {
      'width': 0,
      'height': 0,
      'top': 0,
      'left': 0,
      'opacity': 0,
    };
  }

  redrawTargetBox(): void {
    if (this.alertType === 'Behavioral') {
      if (this.checkBigImage) {
        this.setAlertTargetBox('big');
      }
      this.setAlertTargetBox('small');
    }
  }

  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-explicit-any
  private isNumber(value:any):boolean {
    return typeof value === 'number' && !isNaN(value);
  }

  private setAlertTargetBox(size: string): void {
    if (!this.showAlertTableModal) return;
    if (!this.isNumber(this.latestAlert.leftTopX) || !this.isNumber(this.latestAlert.leftTopY)) return;
    if (!this.isNumber(this.latestAlert.rightBtmX) || !this.isNumber(this.latestAlert.rightBtmY)) return;

    if (size === 'small') {
      this.resetTargetBox();
    }
    if (size === 'big') {
      this.resetBigTargetBox();
    }
    let containerDom: HTMLDataElement = this.ImageContainerRef?.nativeElement;
    if (size === 'big') {
      containerDom = this.BigImageContainerRef?.nativeElement;
    }
    if (containerDom && containerDom.offsetWidth && containerDom.offsetHeight) {
      const originalImgUrl = this.latestAlert.vehicleImage || this.latestAlert.captureImageUrl;
      if (originalImgUrl) {
        this.computeAutoKey(originalImgUrl, containerDom, size).then(() => {
          this.renderTargetBox(containerDom, this.latestAlert, size);
        });
      }
    } else {
      setTimeout(() => {
        this.setAlertTargetBox(size);
      }, 300);
    }
  }

  // Judge the aspect ratio of the picture and do adaptive
  computeAutoKey(url:string, containerDom: HTMLDataElement, size:string):Promise<undefined> {
    this.originImageObject = {
      autoKey: '',
      originalWidth: 0,
      originalHeight: 0,
    };
    return new Promise((resolve): void => {
      if (url) {
        const img = new Image();
        let autoKey = '';
        img.src = url;
        img.onload = (): void => {
          if ((img.width / img.height).toFixed(3) > (containerDom.offsetWidth / containerDom.offsetHeight).toFixed(3)) {
            autoKey = 'width';
          } else {
            autoKey = 'height';
          }
          if (size === 'small') {
            this.originImageObject['autoKey'] = autoKey;
            this.originImageObject['originalWidth'] = img.width;
            this.originImageObject['originalHeight'] = img.height;
          } else if (size === 'big') {
            this.bigOriginImageObject['autoKey'] = autoKey;
            this.bigOriginImageObject['originalWidth'] = img.width;
            this.bigOriginImageObject['originalHeight'] = img.height;
          }
          resolve(undefined);
        };
      }
    });
  }

  // Calculate the interval range
  renderTargetBox(containerDom: HTMLDataElement, data:LatestAlert, size:string):void {
    let autoKey = '';
    let originalWidth = 0;
    let originalHeight = 0;
    if (size === 'small') {
      autoKey = this.originImageObject.autoKey;
      originalWidth = this.originImageObject.originalWidth;
      originalHeight = this.originImageObject.originalHeight;
    } else if (size === 'big') {
      autoKey = this.bigOriginImageObject.autoKey;
      originalWidth = this.bigOriginImageObject.originalWidth;
      originalHeight = this.bigOriginImageObject.originalHeight;
    }
    // Gets the width and height of the image rendering container
    const containerWidth = containerDom.offsetWidth;
    const containerHeight = containerDom.offsetHeight;
    // Set the size (width, height) of the image after rendering.
    // The width is the width of the parent element when the width is adaptive,
    // and the height is the height of the parent element when the height is adaptive
    let renderHeight = 0;
    let renderWidth = 0;
    // Calculate the offset of the image distance x and y when the image is not full.
    // There is no offset of x and y at the same time
    let offsetX = 0;
    let offsetY = 0;
    if (autoKey == 'width') {
      renderWidth = containerWidth;
      renderHeight = Math.ceil(originalHeight / (originalWidth / containerWidth));
      offsetX = 0;
      offsetY = (containerHeight - renderHeight) / 2;
    }
    if (autoKey == 'height') {
      renderWidth = Math.ceil(originalWidth / (originalHeight / containerHeight));
      renderHeight = containerHeight;
      offsetX = (containerWidth - renderWidth) / 2;
      offsetY = 0;
    }
    // According to the rendering ratio of the actual picture,
    // the upper left corner and lower right corner of the structured data are converted
    const scale = originalWidth / renderWidth;
    const leftTopX = Math.floor(data.leftTopX / scale);
    const leftTopY = Math.floor(data.leftTopY / scale);
    const rightBtmX = Math.floor(data.rightBtmX / scale);
    const rightBtmY = Math.floor(data.rightBtmY / scale);
    // Calculate the size and position of the box according to the information of the upper left corner
    // and lower right corner after conversion; Add offset to the position
    if (size === 'small') {
      this.targetBox['width'] = rightBtmX - leftTopX;
      this.targetBox['height'] = rightBtmY - leftTopY;
      this.targetBox['top'] = leftTopY + offsetY;
      this.targetBox['left'] = leftTopX + offsetX;
      this.targetBox['opacity'] = 1;
    } else if (size === 'big') {
      this.bigTargetBox['width'] = rightBtmX - leftTopX;
      this.bigTargetBox['height'] = rightBtmY - leftTopY;
      this.bigTargetBox['top'] = leftTopY + offsetY;
      this.bigTargetBox['left'] = leftTopX + offsetX;
      this.bigTargetBox['opacity'] = 1;
    }
  }

  closeFullImageByEsc = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.checkBigImage = false;
    }
  };

  openBigImage(): void {
    this.checkBigImage = true;
    if (this.alertType === 'Behavioral') {
      this.setAlertTargetBox('big');
    }
  }

  closeBigImage(): void {
    this.checkBigImage = false;
    this.resetBigTargetBox();
  }

  playLiveStream(): void {
    this.checkCameraVideo = true;
    this.showVideoType = 'live-stream';
  }

  playHistoryStream(): void {
    this.checkCameraVideo = true;
    this.showVideoType = 'history-stream';
    this.setHistoryStreamUrl();
  }

  setHistoryStreamUrl(): void {
    this.loadingService.startLoader('video-stream-search-loader');
    const alertId = this.currentTableData.id || this.currentTableData.alertId || '';
    this.mapHttpRequest.getHistoryStreamByIdApi({alertId}).pipe(
      finalize(() => {
        this.loadingService.stopLoader('video-stream-search-loader');
      }),
    ).subscribe(
      {
        next: res => {
          if(res.code === '0' && res.result && Object.keys(res.result).length > 0) {
            this.historyStreamUrl = res.result;
          } else {
            this.historyStreamUrl = '';
          }
        },
        error: () => {
          this.historyStreamUrl = '';
        },
      },
    );
  }

  getCameraInfoByCameraCode(): void {
    this.mapHttpRequest.getCameraInfoApi({cameraCode: this.currentTableData?.cameraId || ''}).pipe(
      finalize(() => {
        const copyData = JSON.parse(JSON.stringify(this.currentTableData));
        this.cameraInfo = Object.assign(copyData, this.cameraInfo);
      }),
    ).subscribe(
      {
        next: res => {
          if(res.code === '0' && res.result && Object.keys(res.result).length > 0) {
            this.cameraInfo = res.result;
          }
        },
      },
    );
  }

  getCameraInfoByCameraCodeError(message: string): void {
    this.resetCameraInfo();
    this.errTips(message);
  }

  getLatestAlertInfo(): void {
    const alertParams = {
      alertType: this.alertType,
      cameraCode: this.currentTableData?.cameraId || '',
      alertId: this.currentTableData?.id || '',
    };
    this.mapHttpRequest.getLatestAlertApi(alertParams).subscribe(
      {
        next: res => {
          if(res.code === '0' && res.result && Object.keys(res.result).length > 0) {
            this.latestAlert = res.result;
          } else {
            this.getLatestAlertInfoError(res.message);
          }
        },
        error: err => {
          this.getLatestAlertInfoError(err.message);
        },
      },
    );
  }

  getLatestAlertInfoError(message: string): void {
    this.resetLatestAlert();
    this.errTips(message);
  }

  override setDetailTab(tab: string): void {
    this.activeDetailTab = tab;
  }
}
