import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { finalize } from 'rxjs';
import { SiteTreeNode } from 'src/app/modules/vehicle-system/components/site-selector/interfaces/http.response';
import {
  InGpuLprTaskSave,
  OutGpuLprTaskSearch,
} from 'src/app/modules/vehicle-system/interfaces/ai-algorithm/ai-algorithm';
import { KeyValueType } from 'src/app/modules/vehicle-system/interfaces/key-value-type';
import { AiAlgorithmService } from 'src/app/modules/vehicle-system/services/ai-algorithm/ai-algorithm.service';
import { MessageService } from 'src/app/modules/vehicle-system/services/common/message.service';
import { CodeItemService } from 'src/app/modules/vehicle-system/services/global-subscription.service';
import { LoggerService } from 'src/app/modules/vehicle-system/utils/logger.service';
import { AiConstLibrary } from '../../../libs/ai-const-library';
import { BaseClassModalComponent } from '../../base-class/base-class-modal/base-class-modal.component';

@Component({
  selector: 'vs-gpu-task-modal',
  templateUrl: './gpu-task-modal.component.html',
  styleUrls: ['./gpu-task-modal.component.scss'],
})
export class GpuTaskModalComponent extends BaseClassModalComponent implements OnInit {
  @Input() taskChannel!: string; // Five kinds Task
  @Input() modalDate!: unknown; // edit data
  @Output() closeModalEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  createEditGpuLprTaskForm!: UntypedFormGroup;
  bindCameraList: string[] = [];
  selectedCameraList: Array<SiteTreeNode> = [];
  selectedCameraListDirty = 0;
  allTaskList = AiConstLibrary.allTaskList;
  siteTreeList: SiteTreeNode[] = [];
  override editModalDate!: OutGpuLprTaskSearch;

  get taskName(): FormControl { return this.createEditGpuLprTaskForm.get('taskName') as FormControl;}

  constructor(
    private formBuilder: UntypedFormBuilder,
    private aiAlgorithmService: AiAlgorithmService,
    protected override messageService: MessageService,
    protected override translocoService: TranslocoService,
    protected override loadingService: NgxUiLoaderService,
    protected override codeItemService: CodeItemService,
    protected override logger: LoggerService,
  ) {
    super(
      translocoService,
      codeItemService,
      loadingService,
      logger,
      messageService,
    );
  }

  override ngOnInit(): void {
    this.editModalDate = this.modalDate as OutGpuLprTaskSearch;
    super.ngOnInit();
  }

  // Form initialization
  override initForm(): void {
    this.createEditGpuLprTaskForm = this.formBuilder.group(
      {taskName: [this.editModalDate?.taskName, [Validators.required]]},
    );
  }

  deleteCamera(code?: string): void {
    this.selectedCameraListDirty++;
    this.bindCameraList = this.bindCameraList.filter(ele => ele !== code);
    this.selectedCameraList = this.selectedCameraList.filter(ele => ele.code !== code);
    this.siteTreeList = this.siteTreeList.filter(ele => ele.code !== code);
  }

  chooseCameraChange(event: Array<SiteTreeNode>): void {
    this.siteTreeList = event;
    this.setSelectedCamera();
  }

  cameraLabel = (item: KeyValueType | unknown): string => {
    const ele = item as KeyValueType;
    return ele['codeDesc'] as string;
  };

  saveClick(): void {
    this.selectedCameraListDirty++;
    this.verifyForm();
  }

  // Verify and update status
  private verifyForm(): void {
    for (const key in this.createEditGpuLprTaskForm.controls) {
      if (this.createEditGpuLprTaskForm.controls) {
        this.createEditGpuLprTaskForm.controls[key].markAsDirty();
        this.createEditGpuLprTaskForm.controls[key].updateValueAndValidity();
      }
    }

    if (this.createEditGpuLprTaskForm.valid && this.bindCameraList.length > 0) {
      this.startRequet();
    }
  }

  private startRequet(): void {
    // Requet
    const inGpuLprTaskSave = new InGpuLprTaskSave();
    inGpuLprTaskSave.id = this.editModalDate?.taskId || '';
    inGpuLprTaskSave.sites = this.siteTreeList;
    inGpuLprTaskSave.taskName = this.createEditGpuLprTaskForm.value.taskName;
    this.gpuLprTaskSave(inGpuLprTaskSave);
  }

  reset(): void {
    this.siteTreeList = [];
    this.selectedCameraListDirty = 0;
    this.bindCameraList = [];
    this.selectedCameraList = [];
    this.createEditGpuLprTaskForm.reset();
    this.createEditGpuLprTaskForm.patchValue({
      task: this.taskChannel,
      taskName: '',
    });
  }

  close(): void {
    this.closeModalEvent.emit();
  }

  dtDataChange(): void {
    this.bindCameraList = [];
    this.siteTreeList.forEach(item => {
      if (item.code) {
        this.bindCameraList.push(item.code);
      }
    });
    this.setSelectedCamera();
  }

  private setSelectedCamera(): void {
    this.selectedCameraList = [];
    this.selectedCameraList = this.siteTreeList;
  }

  private gpuLprTaskSave(event: InGpuLprTaskSave): void {
    this.taskShowLoading();
    this.aiAlgorithmService.gpuLprTaskSave(event).pipe(
      finalize(() => this.taskHideLoading()),
    ).subscribe(
      {
        next: () => {
          const status = event.id ? AiConstLibrary.taskEdited : AiConstLibrary.taskCreated;
          this.successTips(status, event.taskName);
          this.saveSucEmit.emit(true);
        },
        error: err => {
          const status = event.id ? AiConstLibrary.taskEditeFailure : AiConstLibrary.taskCreateFailure;
          this.errorTips(status, event.taskName, err.message);
        },
      },
    );
  }
}
