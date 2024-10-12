import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { finalize } from 'rxjs';
import {
  InBehavioralListTaskSave,
  OutAlgorithmsListSearch,
  WatchAndWhiteCreateTask,
} from "src/app/modules/vehicle-system/interfaces/ai-algorithm/ai-algorithm";
// import { SiteTreeNode } from 'src/app/modules/vehicle-system/components/site-selector/interfaces/http.response';
// import { InBehavioralListTaskSave, WatchAndWhiteCreateTask } from 'src/app/modules/vehicle-system/interfaces/ai-algorithm/ai-algorithm';
import { CodesArrayItem, KeyValueType, customPositionType } from 'src/app/modules/vehicle-system/interfaces/key-value-type';
import { AiAlgorithmService } from 'src/app/modules/vehicle-system/services/ai-algorithm/ai-algorithm.service';
import { MessageService } from 'src/app/modules/vehicle-system/services/common/message.service';
import { CodeItemService } from 'src/app/modules/vehicle-system/services/global-subscription.service';
import { LoggerService } from 'src/app/modules/vehicle-system/utils/logger.service';
import { SiteTreeNode } from "../../../../../components/site-selector/interfaces/http.response";
import { AiConstLibrary } from '../../../libs/ai-const-library';
import { BaseClassModalComponent } from '../../base-class/base-class-modal/base-class-modal.component';

@Component({
  selector: 'vs-behavioral-task-modal',
  templateUrl: './behavioral-task-modal.component.html',
  styleUrls: [ './behavioral-task-modal.component.scss' ],
})
export class BehavioralTaskModalComponent extends BaseClassModalComponent implements OnInit {
  @Input() taskChannel!: string; // Five kinds Task
  @Input() modalDate!: unknown; // edit data
  @Output() closeModalEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  createEditBehavioralTaskForm!: UntypedFormGroup;
  customPosition!: customPositionType;
  priorityList: Array<string> = [];
  priorityDirty = 0; // Verify use
  taskLevelList: Array<KeyValueType> = [];
  algorithmList: OutAlgorithmsListSearch[] = [];
  globalDeviceInfoInit!: SiteTreeNode;
  algorithmDeviceTree: SiteTreeNode[] = [];
  reloadTreeFlag = true;
  excludedArray: Array<string> = [];
  imageFileUrl = '';
  siteSelectedList: SiteTreeNode[] = [];

  taskCycleList = [
    { key: 'taskCycle1', value: '24-hour task' },
    { key: 'taskCycle2', value: 'Periodic task' },
    { key: 'taskCycle3', value: 'Tour task' },
  ];

  get taskName(): FormControl {
    return this.createEditBehavioralTaskForm.get('taskName') as FormControl;
  }

  get algorithm(): FormControl {
    return this.createEditBehavioralTaskForm.get('algorithm') as FormControl;
  }

  get eventLevel(): FormControl {
    return this.createEditBehavioralTaskForm.get('eventLevel') as FormControl;
  }

  get taskCycle(): FormControl {
    return this.createEditBehavioralTaskForm.get('taskCycle') as FormControl;
  }

  get sitesCodeList(): FormControl {
    return this.createEditBehavioralTaskForm.get('sitesCodeList') as FormControl;
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

  override ngOnInit(): void {
    this.editModalDate = this.modalDate as WatchAndWhiteCreateTask;
    super.ngOnInit();
    this.getAlgorithmsList();
    this.setCustomPosition();
    this.getAllDeviceData();
  }

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

  private getAlgorithmsList(): void {
    this.aiAlgorithmService.algorithmsListSearch().subscribe(
      {
        next: res => {
          this.algorithmList = res.data.result;
        },
        error: err => {
          err.message && this.messageService.error(err.message);
        },
      },
    );
  }

  override setCodeItem(): void {
    this.codeItemFuncMap = { 'LprTaskLevel': this.lprTaskLevelFunc.bind(this) };
    this.initSelectItemData();
  }

  saveClick(): void {
    // Verify and update status
    this.priorityDirty++;
    for (const key in this.createEditBehavioralTaskForm.controls) {
      if (this.createEditBehavioralTaskForm.controls) {
        this.createEditBehavioralTaskForm.controls[key].markAsDirty();
        this.createEditBehavioralTaskForm.controls[key].updateValueAndValidity();
      }
    }

    if (this.createEditBehavioralTaskForm.valid && this.priorityList.length > 0) {
      if(!this.timeDetermine()) return;

      const inTaskSave: InBehavioralListTaskSave = {
        ...this.createEditBehavioralTaskForm.value,
        sites: this.siteSelectedList,
        startDateTime: this.startDate,
        endDateTime: this.endDate,
      };
      delete inTaskSave.sitesCodeList;
      this.behavioralListTaskSaveUpdate(inTaskSave);
    }
  }

  reset(): void {
    this.priorityDirty = 0;
    this.priorityList = [];
    this.createEditBehavioralTaskForm.reset();
    this.createEditBehavioralTaskForm.patchValue({
      task: this.taskChannel,
      taskName: null,
      algorithm: null,
      taskLevel: null,
      taskCycle: null,
      sitesCodeList: [],
      description: null,
    });
  }

  close(): void {
    this.closeModalEvent.emit();
  }

  getAssociatedDevice(algorithmId: string): void {
    this.reloadTreeFlag = false;
    this.aiAlgorithmService.behavioralAlgorithmInfo(algorithmId).subscribe(
      {
        next: res => {
          this.excludedArray = res.result;
          const originDeviceTree  = JSON.parse(JSON.stringify(this.globalDeviceInfoInit));
          this.setAlgorithmDeviceTree(originDeviceTree.children, this.excludedArray);
          this.reloadTreeFlag = true;
          if (originDeviceTree.codeDesc === 'UAE') {
            this.algorithmDeviceTree = originDeviceTree.children;
          } else {
            this.algorithmDeviceTree = originDeviceTree;
          }
        },
        error: err => {
          err.message && this.messageService.error(err.message);
        },
      },
    );
  }

  // Form initialization
  override initForm(): void {
    this.createEditBehavioralTaskForm = this.formBuilder.group({
      task: [ 'BehavioralTask' ],
      taskName: [ this.editModalDate?.taskName, [ Validators.required, Validators.maxLength(this.maxlength) ] ],
      algorithm: [this.editModalDate?.algorithm, [Validators.required]],
      taskCycle: [ 'taskCycle', [ Validators.required ] ],
      sitesCodeList: [this.editModalDate?.sites, Validators.required],
      description: [this.editModalDate?.description],
      taskId: [this.editModalDate?.taskId || ''],
      taskLevel: [ this.editModalDate?.taskLevel ],
    });
  }

  setParamsPriority(type: string): void {
    this.priorityDirty++;
    this.priorityList[0] = type;
    this.createEditBehavioralTaskForm.patchValue({ taskLevel: this.priorityList.join() });
  }

  selectorConfirmOn(selectedList: SiteTreeNode[]): void {
    this.siteSelectedList = selectedList;
    this.createEditBehavioralTaskForm.patchValue({ sitesCodeList: selectedList });
  }

  chooseSitesChange(event: Array<SiteTreeNode>): void {
    this.siteSelectedList = event;
  }

  private behavioralListTaskSaveUpdate(inBehavioralListTaskSave: InBehavioralListTaskSave): void {
    this.taskShowLoading();
    this.aiAlgorithmService.behavioralListTaskSave(inBehavioralListTaskSave).pipe(
      finalize(() => this.taskHideLoading()),
    ).subscribe(
      {
        next: () => {
          this.saveSucEmit.emit(true);
          const status = inBehavioralListTaskSave.taskId ? AiConstLibrary.taskEdited : AiConstLibrary.taskCreated;
          this.successTips(status, inBehavioralListTaskSave.taskName);
        },
        error: err => {
          const status = inBehavioralListTaskSave.taskId ? AiConstLibrary.taskEditeFailure : AiConstLibrary.taskCreateFailure;
          this.errorTips(status, inBehavioralListTaskSave.taskName, err.message);
        },
      },
    );
  }

  private lprTaskLevelFunc(codesArray: Array<CodesArrayItem>): void {
    this.taskLevelList = this.codesArrayForEach(codesArray);
  }

  private getAllDeviceData(): void {
    this.aiAlgorithmService.getAllDeviceData().subscribe(
      {
        next: res => {
          this.globalDeviceInfoInit = res.result;
        },
        error: err => {
          err.message && this.messageService.error(err.message);
        },
      },
    );
  }

  private setAlgorithmDeviceTree(treeNode: SiteTreeNode[], filterIds: string[], parentLevel?:SiteTreeNode): void {
    for (let index = 0; index < treeNode.length; index++) {
      const item = treeNode[index];
      /*
        areaType 1:siteGroup  2:site  3:camera
      */
      if (item.areaType === 3 && filterIds && filterIds.length) {
        if (item.code && filterIds.includes(item.code)) {
          treeNode.splice(index, 1);
          index -= 1;
        }
      }
      if (item.children.length) {
        this.setAlgorithmDeviceTree(item.children, filterIds, item);
      }
    }
    if (parentLevel) {
      parentLevel.childrenCount = parentLevel.children.length;
    }
  }
}
