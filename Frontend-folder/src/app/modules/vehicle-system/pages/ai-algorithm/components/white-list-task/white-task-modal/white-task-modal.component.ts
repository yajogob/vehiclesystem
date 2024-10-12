import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import dayjs from 'dayjs/esm';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { finalize } from 'rxjs';
import {
  InWhitelistTaskSave,
  WatchAndWhiteCreateTask,
} from 'src/app/modules/vehicle-system/interfaces/ai-algorithm/ai-algorithm';
import { CodesArrayItem, DateKey, KeyValueType } from 'src/app/modules/vehicle-system/interfaces/key-value-type';
import { AiAlgorithmService } from 'src/app/modules/vehicle-system/services/ai-algorithm/ai-algorithm.service';
import { MessageService } from 'src/app/modules/vehicle-system/services/common/message.service';
import { CodeItemService } from 'src/app/modules/vehicle-system/services/global-subscription.service';
import { LoggerService } from 'src/app/modules/vehicle-system/utils/logger.service';
import { AiConstLibrary } from '../../../libs/ai-const-library';
import { BaseClassModalComponent } from '../../base-class/base-class-modal/base-class-modal.component';

@Component({
  selector: 'vs-white-task-modal',
  templateUrl: './white-task-modal.component.html',
  styleUrls: ['./white-task-modal.component.scss'],
})
export class WhiteTaskModalComponent extends BaseClassModalComponent implements OnInit, OnDestroy {
  @Input() taskChannel!: string; // Five kinds Task
  @Input() modalDate!: unknown; // edit data

  createEditWatchTaskForm!: UntypedFormGroup;
  regionList: Array<KeyValueType> = [];
  currentRegion = 'all';
  categoryListMap: {[key:string]: KeyValueType[]} = {}; // Plate category
  plateColorList: Array<KeyValueType> = [];
  allTaskList = AiConstLibrary.allTaskList;
  lockStartDate = false;
  selectErrorTips = false;
  limitationType!: 'endAfterToday' | 'dontSelectPastDate';

  get region(): FormControl { return this.createEditWatchTaskForm.get('region') as FormControl; }
  get plateCategory(): FormControl { return this.createEditWatchTaskForm.get('plateCategory') as FormControl; }
  get plateNumber(): FormControl { return this.createEditWatchTaskForm.get('plateNumber') as FormControl; }
  get plateColor(): FormControl { return this.createEditWatchTaskForm.get('plateColor') as FormControl; }

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
    this.limitationDetermine();
    super.ngOnInit();
  }

  private limitationDetermine(): void {
    if (this.editModalDate && Object.keys(this.editModalDate).length > 0) {
      this.limitationType = 'endAfterToday';
    } else {
      this.limitationType = 'dontSelectPastDate';
    }
  }

  override setCodeItem(): void {
    this.codeItemFuncMap = {
      'LprRegion': this.lprRegionFunc.bind(this),
      'LprCategory': this.lprAllRegionFunc.bind(this),
      'LprPlateColor': this.lprPlateColorFunc.bind(this),
    };
    this.initSelectItemData();
  }

  saveClick(): void {
    // Verify and update status
    const inWhitelistTaskSave = new InWhitelistTaskSave();
    for (const key in this.createEditWatchTaskForm.controls) {
      if (this.createEditWatchTaskForm.controls) {
        this.createEditWatchTaskForm.controls[key].markAsDirty();
        this.createEditWatchTaskForm.controls[key].updateValueAndValidity();
        inWhitelistTaskSave[key as keyof InWhitelistTaskSave] = this.createEditWatchTaskForm.controls[key].value;
      }
    }

    if (this.createEditWatchTaskForm.valid && !this.selectErrorTips) {
      if(!this.timeDetermine()) return;

      inWhitelistTaskSave.startDate = this.startDate;
      inWhitelistTaskSave.endDate = this.endDate;
      this.saveRequest(inWhitelistTaskSave);
    }
  }

  saveRequest(data: InWhitelistTaskSave): void {
    if (data.taskId) {
      this.whiteListTaskSaveUpdate(data);
    } else {
      this.whiteListTaskSaveAdd(data);
    }
  }

  reset(): void {
    this.createEditWatchTaskForm.reset();
    this.createEditWatchTaskForm.patchValue({
      task: this.taskChannel,
      region: null,
      category: null,
      plateNumber: null,
      plateColor: null,
      description: null,
    });
    this.initDate();
    this.initForm();
  }

  override selectedDateFn(date: DateKey): void {
    if (date.startDate && date.endDate) {
      this.selectDateTips(date);
      this.startDate = date.startDate;
      this.endDate = date.endDate;
    }
  }

  private selectDateTips(date: DateKey): void {
    if (this.editModalDate && Object.keys(this.editModalDate).length > 0) {
      this.selectErrorTips = dayjs().isAfter(date.endDate);
    }
  }

  override initDate(): void {
    if (this.editModalDate && Object.keys(this.editModalDate).length > 0) {
      this.lockStartDate = true;
      this.initRanges();
      this.startDate = this.editModalDate.startDateTimestamp as number;
      this.endDate = this.editModalDate.endDateTimestamp as number;
      this.selected = {
        startDate: dayjs(this.editModalDate.startDateTimestamp),
        endDate: dayjs(this.editModalDate.endDateTimestamp),
      };
    } else {
      this.createInitDate();
    }
  }

  // Form initialization
  override initForm(): void {
    this.createEditWatchTaskForm = this.formBuilder.group({
      region: [this.editModalDate?.region || null, [Validators.required]],
      plateCategory: [this.editModalDate?.plateCategory],
      plateNumber: [{value: this.editModalDate?.plateNumber, disabled: this.editModalDate?.plateNumber}, [Validators.required]],
      plateColor: [this.editModalDate?.plateColor],
      description: [this.editModalDate?.description],
      taskId: [this.editModalDate?.taskId || ''],
    });
    this.regionChange({'value': this.editModalDate?.region ||''});
  }

  private  whiteListTaskSaveUpdate(inWhitelistTaskSave: InWhitelistTaskSave): void {
    this.taskShowLoading();
    this.aiAlgorithmService.whiteListTaskSaveUpdate(inWhitelistTaskSave).pipe(
      finalize(() => this.taskHideLoading()),
    ).subscribe(
      {
        next: () => {
          this.successTips(AiConstLibrary.taskEdited);
          this.saveSucEmit.emit(true);
        },
        error: err => {
          this.errorTips(AiConstLibrary.taskEditeFailure, '', err.message);
        },
      },
    );
  }

  private whiteListTaskSaveAdd(inWhitelistTaskSave: InWhitelistTaskSave): void {
    this.taskShowLoading();
    this.aiAlgorithmService.whiteListTaskSaveAdd(inWhitelistTaskSave).pipe(
      finalize(() => this.taskHideLoading()),
    ).subscribe(
      {
        next: () => {
          this.successTips(AiConstLibrary.taskCreated);
          this.saveSucEmit.emit(true);
        },
        error: err => {
          this.errorTips(AiConstLibrary.taskCreateFailure, '', err.message);
        },
      },
    );
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
}
