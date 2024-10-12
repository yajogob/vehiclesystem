import {
  animate,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';
import { CodeItemsApi, CodesArrayItem } from 'src/app/modules/vehicle-system/interfaces/key-value-type';
import { AiCreateTaskAccessType, TRAFFICMenuList } from 'src/app/modules/vehicle-system/interfaces/rbac';
import { AiCreateTaskAccess } from 'src/app/modules/vehicle-system/libs/path-library';
import { CodeItemService } from 'src/app/modules/vehicle-system/services/global-subscription.service';
import { DIRECTION, I18nService } from "../../../../../utils/i18n.service";
import { AiConstLibrary } from '../../../libs/ai-const-library';

interface transObjType {
  'behavioral': string;
  'watchList': string;
  'geofenceList': string;
  'whiteList': string;
  'gpuLpr': string;
}

@Component({
  selector: 'vs-shared-task-modal',
  templateUrl: './shared-task-modal.component.html',
  styleUrls: ['./shared-task-modal.component.scss'],
  animations: [
    trigger('slideTrigger', [
      transition(':enter', [
        style({ transform: 'translateX({{tx}})' }),
        animate('200ms ease-in-out', style({ transform: 'translateX(0)' })),
      ], {params: {tx: '100%'}}),
      transition(':leave', [
        animate('200ms ease-in-out', style({ transform: 'translateX({{tx}})' })),
      ], {params: {tx: '100%'}}),
    ])],
})
export class SharedTaskModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() taskChannel!: string; // Five kinds Task
  @Input() editModalDate!: unknown; // edit data
  @Input() addOrEdit: 'add' | 'edit' = 'add';
  @Input() alertOrTask: 'alert' | 'task' = 'task'; // Which entrance
  @Input() taskOrDetails: 'task' | 'details' = 'task';
  @Input() isShow = false;

  @Output() closeModalEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() saveSucEmit: EventEmitter<boolean> = new EventEmitter<boolean>();

  allTaskList: Array<CodesArrayItem> = [];
  alertTypeList: Array<CodesArrayItem> = [];
  taskTypeList: Array<CodesArrayItem> = [];
  activeLangValue = AiConstLibrary.en;
  slideX = "100%";
  activedTask!: string;
  width!: {width: string};
  modalTitle!: string;
  aiCreateTaskAccess = AiCreateTaskAccess;

  private codeItemSub$!: Subscription;

  private transObj: transObjType = {
    'behavioral': 'vs.aiAlgorithm.behavioral',
    'watchList': 'vs.aiAlgorithm.watchListTask',
    'geofenceList': 'vs.aiAlgorithm.geofenceTask',
    'whiteList': 'vs.aiAlgorithm.whiteListDetails',
    'gpuLpr': 'vs.aiAlgorithm.gpuLprTask',
  };

  constructor(
    private codeItemService: CodeItemService,
    private translocoService: TranslocoService,
    private i18nService: I18nService,
  ) {
    const enableRtl = i18nService.getDirection() === DIRECTION.RTL;
    if(enableRtl) {
      this.slideX = "-100%";
    }
  }

  ngOnChanges(): void {
    this.activedTask = this.taskChannel;
    this.modalTitle = this.transObj[this.taskChannel as keyof transObjType];
    if(this.taskOrDetails === 'task') {
      this.width = {'width': '44rem'};
    } else if (this.taskOrDetails === 'details' && this.taskChannel === 'whiteList') {
      this.width = {'width': '72.5rem'};
    }
  }

  ngOnInit(): void {
    this.activeLangValue = this.translocoService.getActiveLang();
    this.initSelectItemData();
  }

  close(): void {
    this.closeModalEvent.emit();
  }

  saveSucEvent(event: boolean): void {
    this.saveSucEmit.emit(event);
  }

  selectName(item: CodesArrayItem): string {
    if (this.activeLangValue === 'en') return item.englishItemName;
    if (this.activeLangValue === 'ar') return item.arabItemName;
    return '';
  }

  private initSelectItemData(): void {
    this.codeItemSub$ = this.codeItemService.subject$.subscribe(
      {
        next: res => {
          this.getCodeItemSuc(res.data);
        },
      },
    );
  }

  private getCodeItemSuc(resultItem: Array<CodeItemsApi>): void {
    resultItem.forEach(item => {
      switch(item.codeType) {
        case 'LprAlgorithmsTaskType':
          this.taskTypeList = item.codesArray.filter(item => !['2', '5'].includes(item.codeItemValue));
          this.alertTypeList = item.codesArray.filter(ele => {
            return ele.codeItemValue === '1' || ele.codeItemValue === '3';
          });
          break;
      }
    });

    this.screenHasAccess();
  }

  private screenHasAccess(): void {
    const taskList: Array<CodesArrayItem> = [];
    const alertList: Array<CodesArrayItem> = [];
    const meunListRes = JSON.parse(localStorage.getItem('menuList') || '[]');
    meunListRes.forEach((item: TRAFFICMenuList) => {
      this.taskTypeList.forEach(ele => {
        if(item.uriSet === this.aiCreateTaskAccess[ele.codeItemValue as keyof AiCreateTaskAccessType]) {
          taskList.push(ele);
        }
      });
      this.alertTypeList.forEach(ele => {
        if(item.uriSet === this.aiCreateTaskAccess[ele.codeItemValue as keyof AiCreateTaskAccessType]) {
          alertList.push(ele);
        }
      });
    });
    this.lprTypeFunc(taskList, alertList);
  }

  private lprTypeFunc(taskList: Array<CodesArrayItem>, alertList: Array<CodesArrayItem>): void {
    if (this.alertOrTask === 'alert') {
      this.allTaskList = JSON.parse(JSON.stringify(alertList));
    } else {
      this.allTaskList = JSON.parse(JSON.stringify(taskList));
    }
    this.dataValueHandle();
  }

  private dataValueHandle(): void {
    this.allTaskList = this.allTaskList.map(item => {
      switch (item['codeItemValue']) {
        case '1':
          item['codeItemValue'] = AiConstLibrary.watchList;
          break;
        case '2':
          item['codeItemValue'] = AiConstLibrary.behavioral;
          break;
        case '3':
          item['codeItemValue'] = AiConstLibrary.geofenceList;
          break;
        case '4':
          item['codeItemValue'] = AiConstLibrary.whiteList;
          break;
        case '5':
          item['codeItemValue'] = AiConstLibrary.gpuLpr;
          break;
      }
      return item;
    });
  }

  ngOnDestroy(): void {
    this.codeItemSub$ && this.codeItemSub$.unsubscribe();
  }
}
