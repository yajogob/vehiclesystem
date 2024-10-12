import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VehicleProfileTimeLineResult, VehicleProfileTimeLineResultValue, styleType } from '../../../../interfaces/vehicle-profile/vehicle-profile';
import { MapService } from '../../../../services/map-event.service';

@Component({
  selector: 'vs-vp-time-line',
  templateUrl: './vp-time-line.component.html',
  styleUrls: [ './vp-time-line.component.scss' ],
})
export class VpTimeLineComponent implements OnInit {

  @Input() timeLineDetailsList: VehicleProfileTimeLineResult[] = [];
  @Output() checkItemEmit: EventEmitter<number> = new EventEmitter<number>();

  previewInfo!: VehicleProfileTimeLineResultValue;
  isShowPreview!: boolean;
  yAxisLocation: styleType = { 'top.px': 0 };
  checkBigImage=false;
  currentBigImage = '';


  constructor(
    private mapService: MapService,
  ) {}

  ngOnInit(): void {
    document.addEventListener('keyup', this.closeFullImageByEsc);
  }


  closeFullImageByEsc = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.checkBigImage = false;
      this.currentBigImage = '';
    }
  };

  // Click to expand the current page
  checkItem(index: number): void {
    this.checkItemEmit.emit(index);
  }

  setMapCenter(data:VehicleProfileTimeLineResultValue): void {
    const center = {
      lat: Number(data.latitude),
      lng: Number(data.longitude),
    };
    this.mapService.subject.next({
      eventType: 'set-map-center',
      data: {center},
    });
  }

  setBigImage(src:string): void {
    this.checkBigImage = true;
    this.currentBigImage = src;
  }

  closeBigImage(): void {
    this.checkBigImage = false;
    this.currentBigImage = '';
  }

  trackByIndex = (index: number): number => {
    return index;
  };

  onMouseEnter(event: MouseEvent, data: VehicleProfileTimeLineResultValue): void {
    this.previewInfo = data;
    if (event.clientY + 420 > window.innerHeight) {
      this.yAxisLocation = { 'bottom.px': 0 };
    } else {
      this.yAxisLocation = { 'top.px': ` ${ event.clientY }` };
    }
    this.isShowPreview = true;
  }

  onMouseLeave(): void {
    this.isShowPreview = false;
  }
}
