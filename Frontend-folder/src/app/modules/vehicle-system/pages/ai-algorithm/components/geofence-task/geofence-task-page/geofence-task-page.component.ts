import { Component, OnChanges, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { ICellRendererParams, RowClickedEvent } from 'ag-grid-community';
import dayjs from 'dayjs/esm';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { finalize } from 'rxjs';
import {
  InGeofenceTaskSearch,
  OutGeofenceTaskSearch,
  PromiseOutGeofenceTaskDetail,
} from 'src/app/modules/vehicle-system/interfaces/ai-algorithm/ai-algorithm';
import { CodesArrayItem, KeyValueType } from 'src/app/modules/vehicle-system/interfaces/key-value-type';
import { TRAFFICMenuList } from 'src/app/modules/vehicle-system/interfaces/rbac';
import { AllResourceList, tableActionsLib } from 'src/app/modules/vehicle-system/libs/path-library';
import { AiAlgorithmService } from 'src/app/modules/vehicle-system/services/ai-algorithm/ai-algorithm.service';
import { CellOperatedEvent, ColDef } from '../../../../../components/pagination-grid';
import { SwitchChangedEvent } from '../../../../../components/pagination-grid/pagination-grid.component';
import { MessageService } from '../../../../../services/common/message.service';
import { CodeItemService } from '../../../../../services/global-subscription.service';
import { PublicModalService } from '../../../../../services/public-modal.service';
import { LoggerService } from '../../../../../utils/logger.service';
import { AiConstLibrary } from '../../../libs/ai-const-library';
import { BaseClassPageComponent } from '../../base-class/base-class-page/base-class-page.component';

@Component({
  selector: 'vs-geofence-task-page',
  templateUrl: './geofence-task-page.component.html',
  styleUrls: [ './geofence-task-page.component.scss' ],
})
export class GeofenceTaskPageComponent extends BaseClassPageComponent implements OnInit, OnChanges {
  geofenceListTaskData: Array<OutGeofenceTaskSearch> = [];
  defaultColDef: ColDef = {};
  geofenceList = AiConstLibrary.geofenceList;
  editModalDate!: OutGeofenceTaskSearch;
  dataTotal = 0;
  autoPageSize = 20;
  detailData: PromiseOutGeofenceTaskDetail = new PromiseOutGeofenceTaskDetail();
  taskLevelList: Array<KeyValueType> = [];

  private formValue!: InGeofenceTaskSearch;

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
    if (this.curTaskType === AiConstLibrary.createTask && this.curTaskValue === this.geofenceList) {
      this.isShowCreateModal = true;
    }
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.setCodeItem();
  }

  createNewTaskEmit(): void {
    this.editModalDate = new OutGeofenceTaskSearch(); // Set empty
    this.addOrEdit = 'add';
    this.paramsJudge('task');
  }

  searchClickEmit(formValue: InGeofenceTaskSearch): void {
    this.formValue = formValue;
    this.resetPageNoAndRequest();
  }

  private setCodeItem(): void {
    this.codeItemFuncMap = { 'LprTaskLevel': this.lprTaskLevelFunc.bind(this) };
    this.initSelectItemData();
  }

  onPageSizeChange(event: number): void {
    this.autoPageSize = event;
  }

  protected override getCurrentPageTaskList(): void {
    this.listShowLoading();
    const inGeofenceTaskSearch: InGeofenceTaskSearch = {
      ...this.formValue,
      startDateTime: this.startDate,
      endDateTime: this.endDate,
      pageSize: this.autoPageSize,
      pageNo: this.pageNo,
    };
    this.aiAlgorithmService.geofenceListTaskSearch(inGeofenceTaskSearch).pipe(
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
          this.geofenceListTaskData = res.content.map(item => {
            item.taskStatus = item.taskStatus === 0;
            return item;
          });
        },
        error: err => {
          this.failedHandle(err.message);
        },
      },
    );
  }

  protected override failedHandle(errMsg: string): void {
    switch (errMsg) {
      case 'GEOFENCETASK_SUBSCRIBE_TASK_NAME_EXIST':
        this.messageService.error(this.translocoService.translate('vs.aiAlgorithm.taskNameExist'));
        break;
      case 'GEOFENCETASK_SUBSCRIBE_TASK_NAME_MAX_LENGTH_50':
        this.messageService.error(this.translocoService.translate('vs.aiAlgorithm.taskNameMaxLength'));
        break;
      case 'GEOFENCETASK_SUBSCRIBE_TASK_CREATE_EXCEPTION':
        this.messageService.error(this.translocoService.translate('vs.aiAlgorithm.taskCreateException'));
        break;
      case 'GEOFENCETASK_SUBSCRIBE_TASK_UPDATE_EXCEPTION':
        this.messageService.error(this.translocoService.translate('vs.aiAlgorithm.taskUpdateStatusException'));
        break;
      case 'GEOFENCETASK_SUBSCRIBE_TASK_END_DATE_EXPIRED':
        this.messageService.error(this.translocoService.translate('vs.aiAlgorithm.taskEndDateExpired'));
    }
  }


  onRowClicked(event: RowClickedEvent): void {
    this.requestDetail(event.data);
  }

  requestDetail(data:PromiseOutGeofenceTaskDetail): void {
    if (data.taskId) {
      this.aiAlgorithmService.geofenceTaskDetail(data.taskId).subscribe(
        {
          next: res => {
            if(res && Object.keys(res).length > 0) {
              this.detailData = Object.assign({}, data, res);
            } else {
              this.detailData = Object.assign({}, data);
            }
            this.requestDetailSuc();
            this.paramsJudge('details');
          },
        },
      );
    }
  }

  requestDetailSuc(): void {
    this.taskLevelList.forEach(item => {
      if (item['value'] === this.detailData.taskLevel) {
        this.detailData.taskLevel = item['key'];
      }
    });
  }

  onCellOperated(event: CellOperatedEvent): void {
    this.editModalDate = event.rowData as OutGeofenceTaskSearch;
    this.executeActionsItem(event);
  }

  onSwitchChange(event: SwitchChangedEvent): void {
    const rowData = event.rowData as OutGeofenceTaskSearch;
    const params = {
      taskId: rowData.taskId,
      taskName: rowData.taskName,
      taskStatus: event.switchValue ? 0 : 1,
    };
    this.geofenceListTaskEnable(params);
  }

  protected override delCallBack(taskName: string): void {
    this.geofenceListTaskDelete(this.editModalDate.taskId, taskName);
  }

  private geofenceListTaskEnable(params: { taskId: number, taskStatus: number, taskName: string }): void {
    this.listShowLoading();
    this.aiAlgorithmService.geofenceListTaskEnable(params).pipe(
      finalize(() => this.listHideLoading()),
    ).subscribe(
      {
        next: () => {
          const status = params.taskStatus === 0 ? AiConstLibrary.taskStarted : AiConstLibrary.taskStopped;
          this.successTips(status, params.taskName);
        },
        error: err => {
          this.getCurrentPageTaskList();
          if (err.message ===  AiConstLibrary.taskCycleExpiredCode) {
            this.errorTips(AiConstLibrary.taskExpired, params.taskName);
          } else {
            const status = params.taskStatus === 0 ? AiConstLibrary.taskStartFailure : AiConstLibrary.taskStopFailure;
            this.errorTips(status, params.taskName);
          }
        },
      },
    );
  }

  private geofenceListTaskDelete(id: number, taskName: string): void {
    const goPre = this.geofenceListTaskData.length === 1 && this.pageNo > 1;
    this.listShowLoading();
    this.aiAlgorithmService.geofenceListTaskDelete(id).pipe(
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

  accessHandle = (accessName: string): boolean => {
    const meunListRes = JSON.parse(localStorage.getItem('menuList') || '[]');
    const accessParams = accessName || '';
    const next = meunListRes.some((item: TRAFFICMenuList) => {
      return item.uriSet.includes(accessParams);
    });
    return next;
  };

  private initTableData(): void {
    const disableSwitch = !this.accessHandle(AllResourceList.geofenceTaskPage_edit);
    this.tableColumnDefs = [
      { field: 'taskId', headerName: 'taskId', flex: 1 },
      { field: 'taskName', headerName: 'taskName', flex: 1 },
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
      { field: 'devicesNumber', headerName: 'numberOfDevices', width: 210 },
      {
        field: 'taskCycle',
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
        field: 'taskStatus',
        headerName: 'taskStatus',
        type: 'switchColumn',
        flex: 1,
        cellRendererParams: { disableSwitch },
      },
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
