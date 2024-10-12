import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { ICellRendererParams } from 'ag-grid-community';
import dayjs from 'dayjs/esm';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { finalize } from 'rxjs';
import { CellOperatedEvent, ColDef, RowClickedEvent } from 'src/app/modules/vehicle-system/components/pagination-grid';
import {
  InWhiteListTaskSearch,
  OutWhiteListTaskSearch,
} from 'src/app/modules/vehicle-system/interfaces/ai-algorithm/ai-algorithm';
import { tableActionsLib } from 'src/app/modules/vehicle-system/libs/path-library';
import { AiAlgorithmService } from 'src/app/modules/vehicle-system/services/ai-algorithm/ai-algorithm.service';
import { CodeItemService } from 'src/app/modules/vehicle-system/services/global-subscription.service';
import { PublicModalService } from 'src/app/modules/vehicle-system/services/public-modal.service';
import { LoggerService } from 'src/app/modules/vehicle-system/utils/logger.service';
import { MessageService } from "../../../../../services/common/message.service";
import { AiConstLibrary } from '../../../libs/ai-const-library';
import { BaseClassPageComponent } from '../../base-class/base-class-page/base-class-page.component';

@Component({
  selector: 'vs-white-list-task-page',
  templateUrl: './white-list-task-page.component.html',
  styleUrls: ['./white-list-task-page.component.scss'],
})
export class WhiteListTaskComponent extends BaseClassPageComponent implements OnInit, OnChanges, OnDestroy {
  whiteListTaskData: Array<OutWhiteListTaskSearch> = [];
  defaultColDef: ColDef = {};
  whiteList = AiConstLibrary.whiteList;
  editModalDate!: OutWhiteListTaskSearch;
  dataTotal = 0;
  autoPageSize = 20;
  curDataTaskId!: string;

  private formValue!: InWhiteListTaskSearch;

  constructor(
    private aiAlgorithmService: AiAlgorithmService,
    protected override codeItemService: CodeItemService,
    protected override logger: LoggerService,
    protected override translocoService: TranslocoService,
    protected override publicModalService: PublicModalService,
    protected override loadingService: NgxUiLoaderService,
    protected override messageService: MessageService,
  ) {
    super(
      codeItemService,
      logger,
      translocoService,
      publicModalService,
      loadingService,
      messageService,
    );
  }

  ngOnChanges(): void {
    if (this.curTaskType === AiConstLibrary.createTask && this.curTaskValue === this.whiteList) {
      this.isShowCreateModal = true;
    }
  }

  override ngOnInit(): void {
    this.initTableData();
  }

  createNewTaskEmit(): void {
    this.editModalDate = new OutWhiteListTaskSearch(); // Set empty
    this.addOrEdit = 'add';
    this.paramsJudge('task');
  }

  searchClickEmit(formValue: InWhiteListTaskSearch): void {
    this.formValue = formValue;
    this.resetPageNoAndRequest();
  }

  onRowClicked(event: RowClickedEvent): void {
    this.curDataTaskId = event.data.taskId;
    this.paramsJudge('details');
  }

  // table clicked delete or edit
  onCellOperated(event: CellOperatedEvent): void {
    this.editModalDate = event.rowData as OutWhiteListTaskSearch;
    this.executeActionsItem(event);
  }

  protected override delCallBack(taskName: string): void {
    this.whitelistTaskDelete(this.editModalDate.taskId, taskName);
  }

  private whitelistTaskDelete(id: string, taskName: string): void {
    const goPre = this.whiteListTaskData.length === 1 && this.pageNo > 1;
    this.listShowLoading();
    this.aiAlgorithmService.whitelistTaskDelete(id).pipe(
      finalize(() => {
        this.listHideLoading();
      }),
    ).subscribe(
      {
        next: () => {
          goPre && this.pageNo --;
          this.getCurrentPageTaskList();
          this.successTips(AiConstLibrary.taskDeleted, taskName);
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

  protected override getCurrentPageTaskList(): void {
    this.listShowLoading();
    const inWhiteListTaskSearch: InWhiteListTaskSearch = {
      ...this.formValue,
      startDate: this.startDate,
      endDate: this.endDate,
      pageSize: this.autoPageSize,
      pageNo: this.pageNo,
    };
    this.aiAlgorithmService.whitelistTaskSearch(inWhiteListTaskSearch).pipe(
      finalize(() => this.listHideLoading()),
    ).subscribe(
      {
        next: res => {
          if (res.total && !res.data.length && this.pageNo > 1) {
            this.pageNo -= 1;
            this.getCurrentPageTaskList();
            return;
          }
          this.dataTotal = res.total as number;
          this.whiteListTaskData = res.data;
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
      {
        field: 'plateNumber', headerName: 'plateNumber', flex:1,
        cellRenderer: (param: ICellRendererParams): string => {
          return `${param.data.regionShort || ''} ${param.data.plateCategory || ''} ${param.data.plateNumber || ''}`;
        },
      },
      {
        field: 'startDate', headerName: 'taskCycle', width: 500,
        cellRenderer (params: ICellRendererParams): string {
          const sDate = dayjs(Number(params.data.startDateTimestamp)).format('MMM D, YYYY');
          const sTime = dayjs(Number(params.data.startDateTimestamp)).format('h:mm A');
          const eDate = dayjs(Number(params.data.endDateTimestamp)).format('MMM D, YYYY');
          const eTime = dayjs(Number(params.data.endDateTimestamp)).format('h:mm A');
          return `<div style="display: flex">
                    <div>
                      <span>${sDate}</span>
                      <br/>
                      <span>${sTime}</span>
                    </div>
                    <div>
                      <span style="padding: 0 10px"> - </span>
                      <br/>
                      <span style="padding: 0 10px"> - </span>
                    </div>
                    <div>
                      <span>${eDate}</span>
                      <br/>
                      <span>${eTime}</span>
                    </div>
                  </div>`;
        },
      },
      { field: 'currentStatus', headerName: 'taskStatus', flex:1},
      {
        field: 'actions',
        headerName: 'actions',
        type:'actionsColumn',
        cellRendererParams:[tableActionsLib.delete, tableActionsLib.edit],
        width: 160,
      },
    ];
    this.transloco();
  }
}
