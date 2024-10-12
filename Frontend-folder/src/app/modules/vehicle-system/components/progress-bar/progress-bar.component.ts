import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { VehicleProfileTimeLineResultValue } from '../../interfaces/vehicle-profile/vehicle-profile';
import { MapService } from "../../services/map-event.service";
@Component({
  selector: 'vs-progress-bar',
  templateUrl: './progress-bar.component.html',
})
export class ProgressBarComponent implements OnDestroy, OnChanges {
  constructor(
    private mapService: MapService,
  ) {
  }

  @Input() vehicleProfileTrackers: VehicleProfileTimeLineResultValue[] = [];

  interval!: ReturnType<typeof setInterval>;
  startTime='';
  endTime='';
  progressPercentage = 0;


  ngOnChanges(): void {
    const trackerList = JSON.parse(JSON.stringify(this.vehicleProfileTrackers));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    trackerList.sort((a:any, b:any) => {
      return a.captureTime - b.captureTime;
    });
    this.startTime = trackerList[0].captureTimeFormat;
    this.endTime = trackerList[trackerList.length - 1].captureTimeFormat;
  }

  ngOnDestroy(): void {
    this.stopProgress();
  }

  startProgress(): void {
    this.progressPercentage = 0;
    this.interval = setInterval(() => {
      this.calculateProgress();
    }, 50);

    this.mapService.subject.next({
      eventType: 'vehicleProfile-map-start-trackers',
      data: {},
    });
  }

  stopProgress(): void {
    clearInterval(this.interval);
  }

  private calculateProgress(): void {
    if (this.progressPercentage < 100) {
      this.progressPercentage += 10;
    } else {
      clearInterval(this.interval); // 达到100%后停止计算
    }
  }
}
