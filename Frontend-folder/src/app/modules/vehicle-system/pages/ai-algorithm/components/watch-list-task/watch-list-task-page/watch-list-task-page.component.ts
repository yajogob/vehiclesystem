import { Component, OnChanges, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { ICellRendererParams } from 'ag-grid-community';
import dayjs from 'dayjs/esm';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { finalize } from 'rxjs';
import { SwitchChangedEvent } from 'src/app/modules/vehicle-system/components/pagination-grid/pagination-grid.component';
import {
  InWatchListTaskSearch,
  OutWatchListTaskSearch,
} from 'src/app/modules/vehicle-system/interfaces/ai-algorithm/ai-algorithm';
import { CodesArrayItem, KeyValueType } from 'src/app/modules/vehicle-system/interfaces/key-value-type';
import { TRAFFICMenuList } from 'src/app/modules/vehicle-system/interfaces/rbac';
import { AllResourceList, tableActionsLib } from 'src/app/modules/vehicle-system/libs/path-library';
import { AiAlgorithmService } from 'src/app/modules/vehicle-system/services/ai-algorithm/ai-algorithm.service';
import { MessageService } from 'src/app/modules/vehicle-system/services/common/message.service';
import { CodeItemService } from 'src/app/modules/vehicle-system/services/global-subscription.service';
import { PublicModalService } from 'src/app/modules/vehicle-system/services/public-modal.service';
import { LoggerService } from 'src/app/modules/vehicle-system/utils/logger.service';
import {
  CellOperatedEvent,
  ColDef,
  RowClickedEvent,
} from "../../../../../components/pagination-grid";
import { AiConstLibrary } from '../../../libs/ai-const-library';
import { BaseClassPageComponent } from '../../base-class/base-class-page/base-class-page.component';

@Component({
  selector: 'vs-watch-list-task-page',
  templateUrl: './watch-list-task-page.component.html',
  styleUrls: ['./watch-list-task-page.component.scss'],
})
export class WatchListTaskPageComponent extends BaseClassPageComponent implements OnInit, OnChanges {
  watchListTaskData: Array<OutWatchListTaskSearch> = [];
  defaultColDef: ColDef = {};
  watchList = AiConstLibrary.watchList;
  editModalDate: OutWatchListTaskSearch = new OutWatchListTaskSearch();
  taskLevelList: Array<KeyValueType> = [];
  taskStatusList: Array<KeyValueType> = [];
  plateColorList: Array<KeyValueType> = [];
  dataTotal = 0;
  autoPageSize = 20;

  private formValue!: InWatchListTaskSearch;

  constructor(
    private aiAlgorithmService: AiAlgorithmService,
    protected override codeItemService: CodeItemService,
    protected override translocoService: TranslocoService,
    protected override publicModalService: PublicModalService,
    protected override logger: LoggerService,
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
    if (this.curTaskType === AiConstLibrary.createTask && this.curTaskValue === this.watchList) {
      this.isShowCreateModal = true;
    }
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.setCodeItem();
  }

  createNewTaskEmit(): void {
    this.editModalDate = new OutWatchListTaskSearch(); // Set empty
    this.addOrEdit = 'add';
    this.paramsJudge('task');
  }

  searchClickEmit(formValue: InWatchListTaskSearch): void {
    this.formValue = formValue;
    this.resetPageNoAndRequest();
  }

  onRowClicked(event: RowClickedEvent): void {
    this.editModalDate = event.data;
    this.paramsJudge('details');
  }

  // table clicked delete or edit
  onCellOperated(event: CellOperatedEvent): void {
    this.editModalDate = event.rowData as OutWatchListTaskSearch;
    this.executeActionsItem(event);
  }

  override delCallBack(taskName: string): void {
    this.watchlistTaskDelete(this.editModalDate.id as string, taskName);
  }

  onSwitchchanged(event: SwitchChangedEvent): void {
    const rowData = event.rowData as OutWatchListTaskSearch;
    const id = rowData.id;
    event.switchValue ? this.watchListTaskEnable(id as string) : this.watchListTaskDisable(id as string);
  }

  private setCodeItem(): void {
    this.codeItemFuncMap = {
      'LprWatchListStatus': this.lprWatchListStatusFunc.bind(this),
      'LprTaskLevel': this.lprTaskLevelFunc.bind(this),
      'LprPlateColor': this.lprPlateColorFunc.bind(this),
    };
    this.initSelectItemData();
  }

  private watchlistTaskDelete(id: string, taskName: string): void {
    const goPre = this.watchListTaskData.length === 1 && this.pageNo > 1;
    this.listShowLoading();
    this.aiAlgorithmService.watchlistTaskDelete(id).pipe(
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
          this.getCurrentPageTaskList();
          this.errorTips(AiConstLibrary.taskDeleteFailure, taskName, err.message);
        },
      },
    );
  }

  private watchListTaskEnable(id: string): void {
    this.listShowLoading();
    this.aiAlgorithmService.watchListTaskEnable(id).pipe(
      finalize(() => this.listHideLoading()),
    ).subscribe(
      {
        next: () => {
          this.successTips(AiConstLibrary.taskStarted);
        },
        error: (err: {message: string}) => {
          this.getCurrentPageTaskList();
          let tipText = AiConstLibrary.taskStartFailure;
          if (err.message ===  AiConstLibrary.taskCycleExpiredCode) {
            tipText = AiConstLibrary.taskExpired;
          }
          this.errorTips(tipText);
        },
      },
    );
  }

  private watchListTaskDisable(id: string): void {
    this.listShowLoading();
    this.aiAlgorithmService.watchListTaskDisable(id).pipe(
      finalize(() => {
        this.listHideLoading();
        this.getCurrentPageTaskList();
      }),
    ).subscribe(
      {
        next: () => {
          this.successTips(AiConstLibrary.taskStopped);
        },
        error: err => {
          this.errorTips(AiConstLibrary.taskStopFailure, '', err.message);
        },
      },
    );
  }

  onPageSizeChange(event: number): void {
    this.autoPageSize = event;
  }

  protected override getCurrentPageTaskList(): void {
    this.listShowLoading();
    const inWatchListTaskSearch: InWatchListTaskSearch = {
      ...this.formValue,
      startDateTime: this.startDate,
      endDateTime: this.endDate,
      pageSize: this.autoPageSize,
      pageNo: this.pageNo,
    };
    this.aiAlgorithmService.watchlistTaskSearch(inWatchListTaskSearch).pipe(
      finalize(() => this.listHideLoading()),
    ).subscribe(
      {
        next: res => {
          if (res.totalElements && !res.content.length && this.pageNo > 1) {
            this.pageNo -= 1;
            this.getCurrentPageTaskList();
            return;
          }
          this.dataTotal = res.totalElements;
          this.watchListTaskData = res.content;
        },
      },
    );
  }

  private lprWatchListStatusFunc(codesArray: Array<CodesArrayItem>): void {
    this.taskStatusList = this.codesArrayForEach(codesArray);
    this.initTableData();
  }

  private lprTaskLevelFunc(codesArray: Array<CodesArrayItem>): void {
    this.taskLevelList = this.codesArrayForEach(codesArray);
    this.initTableData();
  }

  private lprPlateColorFunc(codesArray: Array<CodesArrayItem>): void {
    this.plateColorList = this.codesArrayForEach(codesArray);
  }

  accessHandle = (accessName: string): boolean => {
    const meunListRes = JSON.parse(localStorage.getItem('menuList') || '[]');
    const accessParams = accessName || '';
    const next = meunListRes.some((item: TRAFFICMenuList) => {
      return item.uriSet.includes(accessParams);
    });
    return next;
  };

  private initTableData(): void {
    const disableSwitch = !this.accessHandle(AllResourceList.watchListTaskPage_edit);
    this.tableColumnDefs = [
      { field: 'id', headerName: 'taskId', flex: 1 },
      {
        field: 'plateNumber',
        headerName: 'plateNumber',
        flex: 1,
        cellRenderer: (param: ICellRendererParams): string => {
          return `${param.data.regionShort || ''} ${param.data.plateCategory || ''} ${param.data.plateNumber || ''}`;
        },
      },
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
          return `<div class="priority-btn ${css}-btn">${tableValue}</div>`;
        },
      },
      { field: 'devicesNumber', headerName: 'numberOfDevices', width: 210 },
      {
        field: 'startDateTime',
        headerName: 'taskCycle',
        width: 420,
        cellRenderer: (param: ICellRendererParams): string => {
          const sDate = dayjs(Number(param.data.startDateTime)).format('MMM D, YYYY');
          const sTime = dayjs(Number(param.data.startDateTime)).format('h:mm A');
          const eDate = dayjs(Number(param.data.endDateTime)).format('MMM D, YYYY');
          const eTime = dayjs(Number(param.data.endDateTime)).format('h:mm A');
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
      {
        field: 'currentStatus',
        headerName: 'taskStatus',
        type: 'switchColumn',
        flex: 1,
        cellRendererParams: { statusList: this.taskStatusList, disableSwitch },
      },
      {
        field: 'actions',
        headerName: 'actions',
        type: 'actionsColumn',
        cellRendererParams: [tableActionsLib.delete, tableActionsLib.edit],
        width: 120,
      },
    ];
    this.transloco();
  }
}
