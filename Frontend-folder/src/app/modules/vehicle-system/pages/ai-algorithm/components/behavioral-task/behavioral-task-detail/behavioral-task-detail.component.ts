import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PromiseOutBehavioralTaskDetail } from 'src/app/modules/vehicle-system/interfaces/ai-algorithm/ai-algorithm';
import { KeyValueType } from 'src/app/modules/vehicle-system/interfaces/key-value-type';

@Component({
  selector: 'vs-behavioral-task-detail',
  templateUrl: './behavioral-task-detail.component.html',
  styleUrls: [ './behavioral-task-detail.component.scss' ],
})
export class BehavioralTaskDetailComponent {
  @Input() detailData: PromiseOutBehavioralTaskDetail = new PromiseOutBehavioralTaskDetail();// edit data

  @Input() plateColorList: Array<{ [key: string]: string }> = [];
  @Input() taskStatusList: Array<{ [key: string]: string }> = [];
  @Input() taskLevelList: Array<{ [key: string]: string }> = [];
  @Output() closeModalEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  cssMap: KeyValueType = { '1': 'minor', '2': 'major', '3': 'critical' };

  close(): void {
    this.closeModalEvent.emit();
  }
}
