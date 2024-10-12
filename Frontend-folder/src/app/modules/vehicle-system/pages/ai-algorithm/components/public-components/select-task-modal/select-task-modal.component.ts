import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';
import { SelectType } from 'src/app/modules/vehicle-system/interfaces/key-value-type';
import { AllResourceList } from 'src/app/modules/vehicle-system/libs/path-library';
import { AiConstLibrary } from '../../../libs/ai-const-library';

@Component({
  selector: 'vs-select-task-modal',
  templateUrl: './select-task-modal.component.html',
  styleUrls: ['./select-task-modal.component.scss'],
})
export class SelectTaskModalComponent implements OnInit, OnDestroy {
  allResourceList = AllResourceList;

  @Output() closeTaskModalEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() selectTaskEmit: EventEmitter<string> = new EventEmitter<string>();

  @Input() titleTop = 'vs.aiAlgorithm.algorithm';
  @Input() titleBottom = 'vs.aiAlgorithm.task';
  @Input() taskList: Array<SelectType> = [
    {label: 'vs.aiAlgorithm.behavioral', value: AiConstLibrary.behavioral, accessName: this.allResourceList.BehavioralListTask},
    {label: 'vs.aiAlgorithm.watchList', value: AiConstLibrary.watchList, accessName: this.allResourceList.WatchListListTask},
    {label: 'vs.aiAlgorithm.geofence', value: AiConstLibrary.geofenceList, accessName: this.allResourceList.GeofenceListTask},
    {label: 'vs.aiAlgorithm.whiteList', value: AiConstLibrary.whiteList, accessName: this.allResourceList.WhiteListListTask},
    // {label: 'vs.aiAlgorithm.gpuLpr', value: AiConstLibrary.gpuLpr},
  ];

  private selectTranslate$!: Subscription;

  constructor(
    private translocoService: TranslocoService,
  ) {}

  ngOnInit(): void {
    this.transloco();
  }

  closeTaskModal(): void {
    this.closeTaskModalEmit.emit();
  }

  selectTask(taskValue: string): void {
    this.selectTaskEmit.emit(taskValue);
  }

  private transloco(): void {
    this.taskList.forEach(e => {
      this.selectTranslate$ = this.translocoService.selectTranslate(`${e.label}`).subscribe(value => {
        e.label = value;
      });
    });
  }

  ngOnDestroy(): void {
    if(this.selectTranslate$) {
      this.selectTranslate$.unsubscribe();
    }
  }
}
