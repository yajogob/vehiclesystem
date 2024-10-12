import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PromiseOutGeofenceTaskDetail } from 'src/app/modules/vehicle-system/interfaces/ai-algorithm/ai-algorithm';

@Component({
  selector: 'vs-geofence-task-detail',
  templateUrl: './geofence-task-detail.component.html',
  styleUrls: [ './geofence-task-detail.component.scss' ],
})
export class GeofenceTaskDetailComponent {
  @Input() detailData: PromiseOutGeofenceTaskDetail = new PromiseOutGeofenceTaskDetail();// edit data

  @Input() plateColorList: Array<{ [key: string]: string }> = [];
  @Input() taskStatusList: Array<{ [key: string]: string }> = [];
  @Input() taskLevelList: Array<{ [key: string]: string }> = [];
  @Output() closeModalEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  close(): void {
    this.closeModalEvent.emit();
  }
}
