import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { finalize } from "rxjs";
import {
  InBehavioralListTaskSave,
  InBehavioralTaskSearch,
  OutBehavioralTaskSearch,
  PromiseOutBehavioralTaskDetail,
} from 'src/app/modules/vehicle-system/interfaces/ai-algorithm/ai-algorithm';
import { CodesArrayItem, KeyValueType } from 'src/app/modules/vehicle-system/interfaces/key-value-type';
import { AiAlgorithmService } from 'src/app/modules/vehicle-system/services/ai-algorithm/ai-algorithm.service';
import { MessageService } from 'src/app/modules/vehicle-system/services/common/message.service';
import { CodeItemService } from 'src/app/modules/vehicle-system/services/global-subscription.service';
import { PublicModalService } from 'src/app/modules/vehicle-system/services/public-modal.service';
import {
  CellOperatedEvent,
  ColDef,
  ICellRendererParams,
  RowClickedEvent,
} from '../../../../../components/pagination-grid';
import { SwitchChangedEvent } from '../../../../../components/pagination-grid/pagination-grid.component';
import { tableActionsLib } from "../../../../../libs/path-library";
import { LoggerService } from '../../../../../utils/logger.service';
import { AiConstLibrary } from '../../../libs/ai-const-library';
import { BaseClassPageComponent } from '../../base-class/base-class-page/base-class-page.component';

@Component({
  selector: 'vs-behavioral-task-page',
  templateUrl: './behavioral-task-page.component.html',
  styleUrls: [ './behavioral-task-page.component.scss' ],
})
export class BehavioralTaskPageComponent extends BaseClassPageComponent implements OnInit, OnChanges, OnDestroy {
  // table clicked delete or edit
  behavioralTaskData: Array<OutBehavioralTaskSearch> = [];
  pagedBehavioralTask: Array<OutBehavioralTaskSearch> = [];
  editModalDate!: OutBehavioralTaskSearch;
  behavioral = AiConstLibrary.behavioral;
  defaultColDef: ColDef = {};
  taskLevelList: Array<KeyValueType> = [];
  dataTotal = 0;
  autoPageSize = 20;
  detailData: PromiseOutBehavioralTaskDetail = new PromiseOutBehavioralTaskDetail();
  private formValue!: InBehavioralTaskSearch;

  constructor(
    private aiAlgorithmService: AiAlgorithmService,
    protected override codeItemService: CodeItemService,
    protected override logger: LoggerService,
    protected override translocoService: TranslocoService,
    protected override publicModalService: PublicModalService,
    protected override loadingService: NgxUiLoaderService,
    protected override messageService: MessageService,
  ) {
    super(codeItemService,
      logger,
      translocoService,
      publicModalService,
      loadingService,
      messageService,
    );
  }

  ngOnChanges(): void {
    this.isShowCreateModal = this.curTaskType === AiConstLibrary.createTask;
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.setCodeItem();  // get codeItem,  Please refer to other pages
  }

  private setCodeItem(): void {
    this.codeItemFuncMap = { 'LprTaskLevel': this.lprTaskLevelFunc.bind(this) };
    this.initSelectItemData();
  }

  createNewTaskEmit(): void {
    this.editModalDate = new OutBehavioralTaskSearch(); // Set empty
    this.addOrEdit = 'add';
    this.paramsJudge('task');
  }

  searchClickEmit(formValue: InBehavioralTaskSearch): void {
    this.formValue = formValue;
    this.resetPageNoAndRequest();
  }

  onRowClicked(event: RowClickedEvent): void {
    this.editModalDate = event.data;
    this.detailData = event.data as PromiseOutBehavioralTaskDetail;
    this.paramsJudge('details');
  }

  onCellOperated(event: CellOperatedEvent): void {
    this.editModalDate = event.rowData as OutBehavioralTaskSearch;
    this.editModalDate.id = this.editModalDate.algoPackageId as string;
    this.executeActionsItem(event);
  }

  onSwitchChange(event: SwitchChangedEvent): void {
    const rowData = event.rowData as OutBehavioralTaskSearch;
    rowData.enabled = event.switchValue;
    // console.warn('mediaui ~  file: behavioral-task-page.component.ts:103 ~  rowData:', rowData, this);
    this.behavioralListTaskSaveUpdate(rowData);
  }

  protected override delCallBack(taskName: string): void {
    this.behavioralTaskDelete(this.editModalDate.taskId, taskName);
  }

  private behavioralListTaskSaveUpdate(inBehavioralListTaskSave: InBehavioralListTaskSave): void {
    this.listShowLoading();
    this.aiAlgorithmService.behavioralListTaskSave(inBehavioralListTaskSave).pipe(
      finalize(() => this.listHideLoading()),
    ).subscribe(
      {
        next: () => {
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

  private behavioralTaskDelete(id: string, taskName: string): void {
    const goPre = this.pagedBehavioralTask.length === 1 && this.pageNo > 1;
    this.listShowLoading();
    this.aiAlgorithmService.behavioralTaskDelete(id).pipe(
      finalize(() => this.listHideLoading()),
    ).subscribe(
      {
        next: () => {
          goPre && this.pageNo --;
          this.successTips(AiConstLibrary.taskDeleted, taskName);
          this.getCurrentPageTaskList();
        },
        error: err => {
          this.errorTips(AiConstLibrary.taskDeleteFailure, taskName, err.message);
        },
      },
    );
  }

  onPageSizeChange(event: number): void {
    this.autoPageSize = event;
  }

  override getCurrentPageTaskList(): void {
    this.listShowLoading();
    const InBehavioralTaskSearch: InBehavioralTaskSearch = {
      ...this.formValue,
      startDateTime: this.startDate,
      endDateTime: this.endDate,
      pageSize: this.autoPageSize,
      pageNo: this.pageNo,
    };
    this.aiAlgorithmService.behavioralTaskSearch(InBehavioralTaskSearch).pipe(
      finalize(() => this.listHideLoading()),
    ).subscribe(
      {
        next: res => {
          if (res.totalElements && !res.content.length && this.pageNo > 1) {
            this.pageNo -= 1;
            this.getCurrentPageTaskList();
            return;
          }
          this.dataTotal = res.totalElements as number;
          this.pagedBehavioralTask = res.content.map(item => {
            item.taskStatus = item.enabled ? '1' : '0';
            return item;
          });
        },
        error: err => {
          this.failedHandle(err.message);
        },
      },
    );
  }

  private initTableData(): void {
    this.tableColumnDefs = [
      { field: 'taskId', headerName: 'taskId', flex: 1 },
      { field: 'taskName', headerName: 'taskName', flex: 1 },
      { field: 'algoTaskType', headerName: 'algorithmType', flex: 1 },
      {
        field: 'taskLevel',
        headerName: 'priority',
        flex: 1,
        cellRenderer: (params: ICellRendererParams): string => {
          const cssMap: KeyValueType = { '1': 'minor', '2': 'major', '3': 'critical' };
          let tableValue, css;
          this.taskLevelList.forEach(item => {
            if (item['value'] === params.value) {
              tableValue = item['key'];
              css = cssMap[params.value];
            }
          });
          return `<span class="priority-btn ${ css }-btn">${ tableValue }</span>`;
        },
      },
      { field: 'noOfDevice', headerName: 'noOfDevice', flex: 1 },
      { field: 'taskStatus', headerName: 'taskStatus', type: 'switchColumn', flex: 1 },
      { field: 'taskCycle', headerName: 'taskCycle', flex: 1 },
      { field: 'computingCapability', headerName: 'computingCapability', width: 300 },
      {
        field: 'actions',
        headerName: 'actions',
        type: 'actionsColumn',
        cellRendererParams: [ tableActionsLib.delete, tableActionsLib.edit ],
        width: 120,
      },
    ];
    this.transloco();
  }

  private lprTaskLevelFunc(codesArray: Array<CodesArrayItem>): void {
    this.taskLevelList = this.codesArrayForEach(codesArray);
    this.initTableData();
  }
}
