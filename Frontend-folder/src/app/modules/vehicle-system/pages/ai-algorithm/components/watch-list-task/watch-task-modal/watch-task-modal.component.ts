import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { finalize } from 'rxjs';
import { SiteTreeNode } from 'src/app/modules/vehicle-system/components/site-selector/interfaces/http.response';
import {
  InWatchListTaskSave,
  WatchAndWhiteCreateTask,
} from 'src/app/modules/vehicle-system/interfaces/ai-algorithm/ai-algorithm';
import { CodesArrayItem, KeyValueType, customPositionType } from 'src/app/modules/vehicle-system/interfaces/key-value-type';
import { AiAlgorithmService } from 'src/app/modules/vehicle-system/services/ai-algorithm/ai-algorithm.service';
import { MessageService } from 'src/app/modules/vehicle-system/services/common/message.service';
import { CodeItemService } from 'src/app/modules/vehicle-system/services/global-subscription.service';
import { LoggerService } from 'src/app/modules/vehicle-system/utils/logger.service';
import { AiConstLibrary } from '../../../libs/ai-const-library';
import { BaseClassModalComponent } from '../../base-class/base-class-modal/base-class-modal.component';

@Component({
  selector: 'vs-watch-task-modal',
  templateUrl: './watch-task-modal.component.html',
  styleUrls: ['./watch-task-modal.component.scss'],
})
export class WatchTaskModalComponent extends BaseClassModalComponent implements OnInit, OnDestroy {
  @Input() taskChannel!: string; // Five kinds Task
  @Input() modalDate!: unknown; // edit data
  @Output() closeModalEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  createEditWatchTaskForm!: UntypedFormGroup;
  regionList: Array<KeyValueType> = [];
  currentRegion = 'all';
  categoryListMap: {[key:string]: KeyValueType[]} = {}; // Plate category
  plateColorList: Array<KeyValueType> = [];
  taskLevelList: Array<KeyValueType> = [];
  allTaskList = AiConstLibrary.allTaskList;
  priorityList: Array<string> = [];
  priorityDirty = 0; // Verify use
  siteSelectedList: SiteTreeNode[] = [];
  customPosition!: customPositionType;

  get region(): FormControl { return this.createEditWatchTaskForm.get('region') as FormControl; }
  get plateCategory(): FormControl { return this.createEditWatchTaskForm.get('plateCategory') as FormControl; }
  get plateNumber(): FormControl { return this.createEditWatchTaskForm.get('plateNumber') as FormControl; }
  get plateColor(): FormControl { return this.createEditWatchTaskForm.get('plateColor') as FormControl; }
  get sitesCodeList(): FormControl { return this.createEditWatchTaskForm.get('sitesCodeList') as FormControl; }

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
    this.setCustomPosition();
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

  override setCodeItem(): void {
    this.codeItemFuncMap = {
      'LprRegion': this.lprRegionFunc.bind(this),
      'LprCategory': this.lprAllRegionFunc.bind(this),
      'LprPlateColor': this.lprPlateColorFunc.bind(this),
      'LprTaskLevel': this.lprTaskLevelFunc.bind(this),
    };
    this.initSelectItemData();
  }

  saveClick(): void {
    this.priorityDirty++;
    // Verify and update status
    for (const key in this.createEditWatchTaskForm.controls) {
      if (this.createEditWatchTaskForm.controls) {
        this.createEditWatchTaskForm.controls[key].markAsDirty();
        this.createEditWatchTaskForm.controls[key].updateValueAndValidity();
      }
    }

    if (this.createEditWatchTaskForm.valid && this.priorityList.length > 0) {
      if(!this.timeDetermine()) return;

      const inTaskSave: InWatchListTaskSave = {
        ...this.createEditWatchTaskForm.value,
        startDateTime: this.startDate,
        endDateTime: this.endDate,
        sites: this.siteSelectedList,
      };
      delete inTaskSave.sitesCodeList;
      this.watchListTaskSave(inTaskSave);
    }
  }

  reset(): void {
    this.siteSelectedList = [];
    this.priorityDirty = 0;
    this.priorityList = [];
    this.createEditWatchTaskForm.reset();
    this.initDate();
    this.initForm();
  }

  close(): void {
    this.closeModalEvent.emit();
  }

  setParamsPriority(type: string): void {
    this.priorityDirty++;
    this.priorityList[0] = type;
    this.createEditWatchTaskForm.patchValue({taskLevel: this.priorityList.join()});
  }

  selectorConfirmOn(selectedList: SiteTreeNode[]): void {
    this.siteSelectedList = selectedList;
    this.createEditWatchTaskForm.patchValue({ sitesCodeList: selectedList });
  }

  chooseCameraChange(event: Array<SiteTreeNode>): void {
    this.siteSelectedList = event;
  }

  cameraLabel = (item: KeyValueType | unknown): string => {
    const ele = item as KeyValueType;
    return ele['codeDesc'] as string;
  };

  private watchListTaskSave(inWatchListTaskSave: InWatchListTaskSave): void {
    this.taskShowLoading();
    this.aiAlgorithmService.watchListTaskSave(inWatchListTaskSave)
      .pipe(
        finalize(() => this.taskHideLoading()),
      ).subscribe(
        {
          next: () => {
            this.saveSucEmit.emit(true);
            const status = inWatchListTaskSave.id ? AiConstLibrary.taskEdited : AiConstLibrary.taskCreated;
            this.successTips(status);
          },
          error: err => {
            const status = inWatchListTaskSave.id ? AiConstLibrary.taskEditeFailure : AiConstLibrary.taskCreateFailure;
            this.errorTips(status, '', err.message);
          },
        },
      );
  }

  // Form initialization
  override initForm(): void {
    this.createEditWatchTaskForm = this.formBuilder.group({
      region: [this.editModalDate?.region || null, [Validators.required]],
      plateCategory: [this.editModalDate?.plateCategory],
      plateNumber: [this.editModalDate?.plateNumber, [Validators.required]],
      plateColor: [this.editModalDate?.plateColor],
      sitesCodeList: [this.editModalDate?.sites, Validators.required],
      description: [this.editModalDate?.remark || ''],
      id: [this.editModalDate?.id || ''],
      taskLevel: [this.editModalDate?.taskLevel],
    });
    this.priorityList = this.editModalDate?.taskLevel?.split(',') || [];
    this.regionChange({'value': this.editModalDate?.region ||''});
  }

  override initDate(): void {
    if (this.editModalDate?.id) {
      this.priorityList = this.editModalDate?.taskLevel?.split(',') || [];
      this.siteSelectedList = this.editModalDate?.sites;
      this.editInitDate();
    } else {
      this.createInitDate();
    }
  }

  regionChange(event: KeyValueType): void {
    this.currentRegion = event ? event['value'] : '';
    const categoryList = this.categoryListMap[this.currentRegion] || [];
    const plateCategory = this.createEditWatchTaskForm.get('plateCategory')?.value;
    let flag = true;
    for (let i = 0; i < categoryList.length; i++) {
      const element = categoryList[i];
      if (element['value'] === plateCategory) {
        flag = false;
        break;
      }
    }
    flag && this.createEditWatchTaskForm.patchValue({ plateCategory: null });
  }

  clearRegion(): void {
    this.currentRegion = 'all';
    this.createEditWatchTaskForm.patchValue({ plateCategory: null });
  }

  private lprRegionFunc(codesArray: Array<CodesArrayItem>): void {
    this.regionList = this.codesArrayForEach(codesArray);
    this.regionList.forEach(item => {
      for (let i = 0; i < this.codeDictList.length; i++) {
        const codeItems = this.codeDictList[i];
        if (codeItems.codeType === `LprRegion_${item['value']}`) {
          this.categoryListMap[item['value']] = this.codesArrayForEach(codeItems.codesArray);
          break;
        }
      }
    });
  }

  private lprAllRegionFunc(codesArray: Array<CodesArrayItem>): void {
    this.categoryListMap['all'] = this.codesArrayForEach(codesArray);
  }

  private lprPlateColorFunc(codesArray: Array<CodesArrayItem>): void {
    this.plateColorList = this.codesArrayForEach(codesArray);
  }

  private lprTaskLevelFunc(codesArray: Array<CodesArrayItem>): void {
    this.taskLevelList = this.codesArrayForEach(codesArray);
  }
}
