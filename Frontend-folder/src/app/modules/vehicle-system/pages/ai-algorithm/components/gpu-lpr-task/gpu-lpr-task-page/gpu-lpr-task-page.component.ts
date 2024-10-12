import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import dayjs from 'dayjs/esm';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { finalize } from 'rxjs';
import {
  CellOperatedEvent,
  ColDef,
  ICellRendererParams,
  RowClickedEvent,
} from 'src/app/modules/vehicle-system/components/pagination-grid';
import { InGpuLprTaskSearch, OutGpuLprTaskSearch } from 'src/app/modules/vehicle-system/interfaces/ai-algorithm/ai-algorithm';
import { CodeItemsApi, CodesArrayItem, KeyValueType } from 'src/app/modules/vehicle-system/interfaces/key-value-type';
import { tableActionsLib } from 'src/app/modules/vehicle-system/libs/path-library';
import { AiAlgorithmService } from 'src/app/modules/vehicle-system/services/ai-algorithm/ai-algorithm.service';
import { MessageService } from 'src/app/modules/vehicle-system/services/common/message.service';
import { CodeItemService } from 'src/app/modules/vehicle-system/services/global-subscription.service';
import { PublicModalService } from 'src/app/modules/vehicle-system/services/public-modal.service';
import { LoggerService } from 'src/app/modules/vehicle-system/utils/logger.service';
import { AiConstLibrary } from '../../../libs/ai-const-library';
import { BaseClassPageComponent } from '../../base-class/base-class-page/base-class-page.component';

@Component({
  selector: 'vs-gpu-lpr-task-page',
  templateUrl: './gpu-lpr-task-page.component.html',
  styleUrls: ['./gpu-lpr-task-page.component.scss'],
})
export class GpuLprTaskPageComponent extends BaseClassPageComponent implements OnInit, OnDestroy, OnChanges {
  gpuLpr = AiConstLibrary.gpuLpr;
  defaultColDef: ColDef = {};
  editModalDate: OutGpuLprTaskSearch = new OutGpuLprTaskSearch();
  gpuLprTaskData: Array<OutGpuLprTaskSearch> = [];
  taskStatusObj: KeyValueType = {};
  cssMap: KeyValueType = AiConstLibrary.gpuStatusCssMap;
  dataTotal = 0;
  autoPageSize = 20;

  private formValue!: InGpuLprTaskSearch;

  constructor(
    private aiAlgorithmService: AiAlgorithmService,
    protected override translocoService: TranslocoService,
    protected override codeItemService: CodeItemService,
    protected override logger: LoggerService,
    protected override loadingService: NgxUiLoaderService,
    protected override messageService: MessageService,
    protected override publicModalService: PublicModalService,
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
    if (this.curTaskType === AiConstLibrary.createTask && this.curTaskValue === this.gpuLpr) {
      this.isShowCreateModal = true;
    }
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.initSelectItemData();
  }

  createNewTaskEmit(): void {
    this.editModalDate = new OutGpuLprTaskSearch(); // Set empty
    this.addOrEdit = 'add';
    this.paramsJudge('task');
  }

  searchClickEmit(formValue: InGpuLprTaskSearch): void {
    this.formValue = formValue;
    this.resetPageNoAndRequest();
  }

  onRowClicked(event: RowClickedEvent): void {
    this.editModalDate = event.data;
    this.paramsJudge('details');
  }

  // table clicked delete or edit
  onCellOperated(event: CellOperatedEvent): void {
    this.editModalDate = event.rowData as OutGpuLprTaskSearch;
    this.executeActionsItem(event);
    if (event.operate === AiConstLibrary.starter) {
      this.starterHandle(this.editModalDate);
    }
  }

  protected override delCallBack(taskName: string): void {
    this.gpuLprTaskDelete(this.editModalDate.taskId, taskName);
  }

  private starterHandle(rowData: OutGpuLprTaskSearch): void {
    if (rowData.taskStatus === '1') this.stopTask(rowData.taskId, rowData.taskName);
    if (rowData.taskStatus === '0' || rowData.taskStatus === '5') this.startTask(rowData.taskId, rowData.taskName);
  }

  private startTask(id: string, taskName: string): void {
    this.listShowLoading();
    this.aiAlgorithmService.gpuLprTaskStart({id}).pipe(
      finalize(() => {
        this.listHideLoading();
        this.getCurrentPageTaskList();
      }),
    ).subscribe(
      {
        next: () => {
          this.successTips(AiConstLibrary.taskStarted, taskName);
        },
        error: err => {
          this.errorTips(AiConstLibrary.taskStartFailure, taskName, err.message);
        },
      },
    );
  }

  private stopTask(id: string, taskName: string): void {
    this.listShowLoading();
    this.aiAlgorithmService.gpuLprTaskStop({id}).pipe(
      finalize(() => {
        this.listHideLoading();
        this.getCurrentPageTaskList();
      }),
    ).subscribe(
      {
        next: () => {
          this.successTips(AiConstLibrary.taskStopped, taskName);
        },
        error: err => {
          this.errorTips(AiConstLibrary.taskStopFailure, taskName, err.message);
        },
      },
    );
  }

  private gpuLprTaskDelete(id: string, taskName: string): void {
    const goPre = this.gpuLprTaskData.length === 1 && this.pageNo > 1;
    this.listShowLoading();
    this.aiAlgorithmService.gpuLprTaskDelete(id).pipe(
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
    const inGpuLprTaskSearch: InGpuLprTaskSearch = {
      ...this.formValue,
      startDateTime: this.startDate,
      endDateTime: this.endDate,
      pageNo: this.pageNo,
      pageSize: this.autoPageSize,
    };
    this.aiAlgorithmService.gpuLprTaskSearch(inGpuLprTaskSearch).pipe(
      finalize(() => this.listHideLoading()),
    ).subscribe(
      {
        next: res => {
          this.dataTotal = res.totalElements;
          this.gpuLprTaskData = res.content;
        },
      },
    );
  }

  protected override getCodeItemSuc(resultItem: Array<CodeItemsApi>): void {
    resultItem.forEach(item => {
      if (item.codeType === AiConstLibrary.lprGPUAlgorithmTaskStatus) {
        this.privateCodesArrayForEach(item.codesArray, this.taskStatusObj);
      }
    });
  }

  private privateCodesArrayForEach(codesArray: Array<CodesArrayItem>, obj: KeyValueType): void {
    codesArray.forEach(item => {
      const key = this.activeLangValue === AiConstLibrary.ar ? item.arabItemName : item.englishItemName;
      obj[item.codeItemValue] = key;
    });
    this.initTableData();
  }

  private initTableData(): void {
    this.tableColumnDefs = [
      {
        field: 'taskName', headerName: 'taskName', flex:1,
        cellRenderer: (params: ICellRendererParams): string => {
          return `<span class='line-clamp-1'>${params.data.taskName || ''}</span>`;
        },
        wrapText: true,
        tooltipField: 'taskName',
      },
      {
        field: 'createTime', headerName: 'createTime', flex:1,
        cellRenderer: (params: ICellRendererParams): string => {
          return dayjs(params.data.createTime).format('MMM D, YYYY h:mm A');
        },
      },
      {
        field: 'taskStatus', headerName: 'taskStatus', flex:1 ,
        cellRenderer: (params: ICellRendererParams): string => {
          return `<span class="${this.cssMap[params.value as keyof KeyValueType]}-status">${this.taskStatusObj[params.value]}</span>`;
        },
      },
      { field: 'cameraQuality', headerName: 'cameraQuantity', flex:1 },
      { field: 'parsingTargetQuality', headerName: 'analysisTargetQuantity', flex:1 },
      { field: 'creator', headerName: 'creator', flex:1 },
      {
        field: 'actions',
        headerName: 'actions',
        type:'actionsColumn',
        cellRendererParams:[tableActionsLib.starter, tableActionsLib.delete, tableActionsLib.edit],
        width: 150,
      },
    ];
    this.transloco();
  }
}
