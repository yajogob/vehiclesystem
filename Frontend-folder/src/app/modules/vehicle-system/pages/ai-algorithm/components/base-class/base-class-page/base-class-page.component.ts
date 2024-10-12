import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslocoService, translate } from '@ngneat/transloco';
import { ColDef } from 'ag-grid-community';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';
import { CellOperatedEvent, PageChangeEvent } from 'src/app/modules/vehicle-system/components/pagination-grid';
import { FcMapType, FcType } from 'src/app/modules/vehicle-system/interfaces/ai-algorithm/ai-algorithm';
import { CodeItemsApi, CodesArrayItem, DateKey, KeyValueType } from 'src/app/modules/vehicle-system/interfaces/key-value-type';
import { AllResourceList } from 'src/app/modules/vehicle-system/libs/path-library';
import { MessageService } from 'src/app/modules/vehicle-system/services/common/message.service';
import { CodeItemService } from 'src/app/modules/vehicle-system/services/global-subscription.service';
import { PublicModalService } from 'src/app/modules/vehicle-system/services/public-modal.service';
import { LoggerService } from 'src/app/modules/vehicle-system/utils/logger.service';
import { AiConstLibrary } from '../../../libs/ai-const-library';

@Component({
  selector: 'vs-base-class-page',
  templateUrl: './base-class-page.component.html',
})
export class BaseClassPageComponent implements OnInit, OnDestroy {
  @Input() curTaskType!: string; // task | createTask
  @Input() curTaskValue!: string; // task | createTask

  @Output() setNotCreateTaskTypeEmit: EventEmitter<boolean> = new EventEmitter<boolean>();

  protected taskOrDetails: 'task' | 'details' = 'task';
  protected addOrEdit: 'add' | 'edit' = 'add';
  protected pageNo = 1;
  protected pageSize = 9;
  protected isShowCreateModal = false;
  protected startDate!: number;
  protected endDate!: number;
  protected tableColumnDefs: ColDef[] = [];
  protected selectTranslate$!: Subscription;
  protected activeLangValue = AiConstLibrary.en;
  protected codeItemSub$!: Subscription;
  protected codeItemFuncMap!: FcMapType;
  protected allResourceList = AllResourceList;

  constructor(
    protected codeItemService: CodeItemService,
    protected logger: LoggerService,
    protected translocoService: TranslocoService,
    protected publicModalService: PublicModalService,
    protected loadingService: NgxUiLoaderService,
    protected messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.activeLangValue = this.translocoService.getActiveLang();
  }

  protected executeActionsItem(event: CellOperatedEvent): void {
    if (event.operate === AiConstLibrary.delete) {
      const data = event.rowData as unknown as {taskName: string};
      const deleteTipsInfo = translate('vs.public.deleteTipsInfo');
      const curTaskName = data.taskName ? data.taskName : '';
      const text = `${deleteTipsInfo} ?`;
      this.publicModalService.showPopConirm({content: text, onOk: this.delCallBack.bind(this, curTaskName)});
    }
    if (event.operate === AiConstLibrary.edit) {
      this.addOrEdit = 'edit';
      this.paramsJudge('task');
    }
  }

  protected delCallBack(name: string): void {
    this.logger.info('delCallBack', name);
  }

  protected paramsJudge(value: 'task' | 'details'): void {
    this.taskOrDetails = value;
    this.isShowCreateModal = true;
  }

  protected resetPageNoAndRequest(): void {
    this.pageNo = 1;
    this.getCurrentPageTaskList();
  }

  protected onPageChange(event: PageChangeEvent): void {
    this.pageNo = event.pageNumber;
    this.getCurrentPageTaskList();
  }

  protected saveSucEvent(event: boolean): void {
    if (event) {
      this.isShowCreateModal = false;
      this.getCurrentPageTaskList();
      this.setNotCreateTaskType();
    }
  }

  protected getCurrentPageTaskList(): void {
    this.logger.info();
  }

  protected selectedDateFnEmit(date: DateKey): void {
    this.startDate = date.startDate as number;
    this.endDate = date.endDate as number;
  }

  protected closeModalEvent(): void {
    this.isShowCreateModal = false;
    this.setNotCreateTaskType();
  }

  private setNotCreateTaskType(): void {
    this.setNotCreateTaskTypeEmit.emit();
  }

  protected initSelectItemData(): void {
    this.codeItemSub$ = this.codeItemService.subject$.subscribe(
      {
        next: res => {
          this.getCodeItemSuc(res.data);
        },
      },
    );
  }

  protected getCodeItemSuc(resultItem: Array<CodeItemsApi>): void {
    resultItem.forEach(item => {
      const fn = this.codeItemFuncMap[item.codeType as keyof FcMapType] as FcType | undefined;
      if (fn) fn(item.codesArray);
    });
  }

  protected codesArrayForEach(codesArray: Array<CodesArrayItem>): Array<KeyValueType> {
    const list: Array<KeyValueType> = [];
    codesArray.forEach(item => {
      const key = this.activeLangValue === AiConstLibrary.ar ? item.arabItemName : item.englishItemName;
      const kvObj = { key, value: item.codeItemValue };
      list.push(kvObj);
    });
    return list;
  }

  protected transloco(): void {
    this.tableColumnDefs.forEach(e => {
      this.selectTranslate$ = this.translocoService.selectTranslate(`vs.aiAlgorithm.${e.headerName}`).subscribe(value => {
        e.headerName = value;
      });
    });
  }

  protected listShowLoading(): void {
    this.loadingService.startLoader('task-loader');
  }

  protected listHideLoading(): void {
    this.loadingService.stopLoader('task-loader');
  }

  protected failedHandle(errMsg: string): void {
    errMsg && this.messageService.error(errMsg);
  }

  protected successTips = (status: string, taskName = ''): void => {
    const name = taskName ? `"${taskName}"  ` : '';
    this.messageService.success(translate(status));
    name;
  };

  protected errorTips = (status: string, taskName = '', errMsg?:string): void => {
    const name = taskName ? `"${taskName}"  ` : '';
    this.messageService.error((errMsg || translate(status)));
    name;
  };

  ngOnDestroy(): void {
    if (this.selectTranslate$) {
      this.selectTranslate$.unsubscribe();
    }
    if (this.codeItemSub$) {
      this.codeItemSub$.unsubscribe();
    }
  }
}
