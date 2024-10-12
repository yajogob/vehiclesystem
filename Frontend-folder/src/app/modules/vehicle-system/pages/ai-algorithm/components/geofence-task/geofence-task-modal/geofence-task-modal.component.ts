import { Component, Input, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { finalize } from 'rxjs';
import { SiteTreeNode } from 'src/app/modules/vehicle-system/components/site-selector/interfaces/http.response';
import { InGeofenceListTaskSave, WatchAndWhiteCreateTask } from 'src/app/modules/vehicle-system/interfaces/ai-algorithm/ai-algorithm';
import { CodesArrayItem, KeyValueType, customPositionType } from 'src/app/modules/vehicle-system/interfaces/key-value-type';
import { AiAlgorithmService } from 'src/app/modules/vehicle-system/services/ai-algorithm/ai-algorithm.service';
import { LoggerService } from 'src/app/modules/vehicle-system/utils/logger.service';
import { MessageService } from '../../../../../services/common/message.service';
import { CodeItemService } from '../../../../../services/global-subscription.service';
import { AiConstLibrary } from '../../../libs/ai-const-library';
import { BaseClassModalComponent } from '../../base-class/base-class-modal/base-class-modal.component';

@Component({
  selector: 'vs-geofence-task-modal',
  templateUrl: './geofence-task-modal.component.html',
  styleUrls: [ './geofence-task-modal.component.scss' ],
})
export class GeofenceTaskModalComponent extends BaseClassModalComponent implements OnInit {
  @Input() taskChannel!: string; // Five kinds Task
  @Input() modalDate!: unknown; // edit data

  createEditGeofenceTaskForm!: UntypedFormGroup;
  priorityList: Array<string> = [];
  taskLevelList: Array<KeyValueType> = [];
  priorityDirty = 0; // Verify use
  // allTaskList = AiConstLibrary.allTaskList
  siteSelectedList: SiteTreeNode[] = [];

  thresholdState = 'Disabled';
  trafficThreshold = false;
  customPosition!: customPositionType;
  lastTrafficThresholdNumber?: number;

  get taskName(): FormControl {
    return this.createEditGeofenceTaskForm.get('taskName') as FormControl;
  }

  get taskCycle(): FormControl {
    return this.createEditGeofenceTaskForm.get('taskCycle') as FormControl;
  }

  get sitesCodeList(): FormControl {
    return this.createEditGeofenceTaskForm.get('sitesCodeList') as FormControl;
  }

  get trafficThresholdNumber(): FormControl {
    return this.createEditGeofenceTaskForm.get('trafficThresholdNumber') as FormControl;
  }

  get trafficThresholdEnable(): FormControl {
    return this.createEditGeofenceTaskForm.get('trafficThresholdEnable') as FormControl;
  }

  constructor(
    private formBuilder: UntypedFormBuilder,
    private aiAlgorithmService: AiAlgorithmService,
    protected override messageService: MessageService,
    protected override translocoService: TranslocoService,
    protected override codeItemService: CodeItemService,
    protected override loadingService: NgxUiLoaderService,
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

  /* ------------------- Life Cycle ------------------- */
  override ngOnInit(): void {
    this.editModalDate = this.modalDate as WatchAndWhiteCreateTask;
    super.ngOnInit();
    this.setCustomPosition();
  }

  /* ------------------- Methods ------------------- */
  private setCustomPosition(): void {
    if(this.activeLangValue === 'en') {
      this.customPosition = {
        position: 'fixed',
        bottom: '-14.2rem',
        left: '-1rem',
      };
    }
    if(this.activeLangValue === 'ar') {
      this.customPosition = {
        position: 'fixed',
        bottom: '-16.6rem',
        left: '-1rem',
      };
    }
  }

  override setCodeItem(): void {
    this.codeItemFuncMap = { 'LprTaskLevel': this.lprTaskLevelFunc.bind(this) };
    this.initSelectItemData();
  }

  saveClick(): void {
    this.priorityDirty++;
    for (const key in this.createEditGeofenceTaskForm.controls) {
      if (this.createEditGeofenceTaskForm.controls) {
        this.createEditGeofenceTaskForm.controls[key].markAsDirty();
        this.createEditGeofenceTaskForm.controls[key].updateValueAndValidity();
      }
    }
    if (this.createEditGeofenceTaskForm.valid && this.priorityList.length > 0) {
      if(!this.timeDetermine()) return;

      const inTaskSave: InGeofenceListTaskSave = {
        ...this.createEditGeofenceTaskForm.value,
        startDateTime: this.startDate,
        endDateTime: this.endDate,
        sites: this.siteSelectedList,
      };
      delete inTaskSave.sitesCodeList;
      this.geofenceListTaskSaveUpdate(inTaskSave);
    }
  }

  reset(): void {
    this.siteSelectedList = [];
    this.priorityDirty = 0;
    this.priorityList = [];
    this.trafficThreshold = false;
    this.createEditGeofenceTaskForm.reset();
    this.initDate();
    this.initForm();
  }

  setParamsPriority(type: string): void {
    this.priorityDirty++;
    this.priorityList[0] = type;
    this.createEditGeofenceTaskForm.patchValue({ taskLevel: this.priorityList.join() });
  }

  switchChanged(value: boolean): void {
    this.trafficThreshold = value;
    this.createEditGeofenceTaskForm.patchValue({ trafficThresholdEnable: value ? 0 : 1 });
    this.thresholdState = value ? 'Enabled' : 'Disabled';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  checkInput(event:any): void {
    const inputValue = event.data;
    let curValue = this.createEditGeofenceTaskForm.controls['trafficThresholdNumber'].value;
    if (['-', '+'].includes(inputValue) && !curValue) {
      curValue = this.lastTrafficThresholdNumber;
    }

    if (curValue % 1 !== 0) {
      curValue = Math.ceil(curValue);
    }
    if (curValue < 0) {
      this.createEditGeofenceTaskForm.patchValue(
        {trafficThresholdNumber: 0},
      );
      this.lastTrafficThresholdNumber = 0;
    } else if (curValue > 99999) {
      this.createEditGeofenceTaskForm.patchValue(
        {trafficThresholdNumber: 99999},
      );
      this.lastTrafficThresholdNumber = 99999;
    } else {
      this.createEditGeofenceTaskForm.patchValue(
        {trafficThresholdNumber: curValue},
      );
      this.lastTrafficThresholdNumber = curValue;
    }
  }

  thresholdNumber(type: 'up' | 'down'): void {
    if(this.trafficThreshold) {
      let curValue = this.createEditGeofenceTaskForm.controls['trafficThresholdNumber'].value;
      if (type === 'up' && curValue < 99999) curValue += 1;
      if (type === 'down' && curValue > 0) curValue -= 1;
      this.createEditGeofenceTaskForm.patchValue(
        {trafficThresholdNumber: curValue},
      );
    }
  }

  selectorConfirmOn(selectedList: SiteTreeNode[]): void {
    this.siteSelectedList = selectedList;
    this.createEditGeofenceTaskForm.patchValue({ sitesCodeList: selectedList });
  }

  chooseSitesChange(event: Array<SiteTreeNode>): void {
    this.siteSelectedList = event;
  }

  /* ------------------- Private Methods ------------------- */

  override initDate(): void {
    if (this.editModalDate?.taskId) {
      this.priorityList = this.editModalDate?.taskLevel?.split(',') || [];
      this.siteSelectedList = this.editModalDate?.sites;
      this.editInitDate();
    } else {
      this.createInitDate();
    }
  }

  // Form initialization
  override initForm(): void {
    let trafficThresholdEnable = 1;
    if (this.editModalDate?.trafficThresholdEnable == 0 || this.editModalDate?.trafficThresholdEnable == 1) {
      trafficThresholdEnable = this.editModalDate?.trafficThresholdEnable;
    }
    this.createEditGeofenceTaskForm = this.formBuilder.group({
      taskName: [ this.editModalDate?.taskName, [ Validators.required, Validators.maxLength(this.maxlength) ] ],
      description: [ this.editModalDate?.description ],
      trafficThresholdEnable,
      trafficThresholdNumber: [ this.editModalDate?.trafficThresholdNumber || 0, [ Validators.required ] ],
      sitesCodeList: [this.editModalDate?.sites, Validators.required],
      taskId: [ this.editModalDate?.taskId || '' ],
      taskLevel: [ this.editModalDate?.taskLevel ],
    });
    this.switchChanged(trafficThresholdEnable != 1);
    this.priorityList = this.editModalDate?.taskLevel?.split(',') || [];
  }

  private geofenceListTaskSaveUpdate(inGeofenceListTaskSave: InGeofenceListTaskSave): void {
    this.taskShowLoading();
    this.aiAlgorithmService.geofenceListTaskSave(inGeofenceListTaskSave).pipe(
      finalize(() => this.taskHideLoading()),
    ).subscribe(
      {
        next: () => {
          this.saveSucEmit.emit(true);
          const status = inGeofenceListTaskSave.taskId ? AiConstLibrary.taskEdited : AiConstLibrary.taskCreated;
          this.successTips(status, inGeofenceListTaskSave.taskName);
        },
        error: err => {
          const status = inGeofenceListTaskSave.taskId ? AiConstLibrary.taskEditeFailure : AiConstLibrary.taskCreateFailure;
          this.errorTips(status, inGeofenceListTaskSave.taskName, err.message);
        },
      },
    );
  }

  private lprTaskLevelFunc(codesArray: Array<CodesArrayItem>): void {
    this.taskLevelList = this.codesArrayForEach(codesArray);
  }
}
