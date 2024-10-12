import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OutGpuLprTaskSearch } from 'src/app/modules/vehicle-system/interfaces/ai-algorithm/ai-algorithm';
import { KeyValueType } from 'src/app/modules/vehicle-system/interfaces/key-value-type';

@Component({
  selector: 'vs-gpu-lpr-task-detail',
  templateUrl: './gpu-lpr-task-detail.component.html',
  styleUrls: ['./gpu-lpr-task-detail.component.scss'],
})
export class GpuLprTaskDetailComponent {
  @Input() editModalDate!: OutGpuLprTaskSearch; // edit data
  @Input() taskStatusObj!: KeyValueType; // status data

  @Output() closeModalEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  close(): void {
    this.closeModalEvent.emit();
  }

  statusHandle(status: string): string {
    return this.taskStatusObj[status] as string;
  }
}
