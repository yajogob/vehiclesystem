import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslocoService, translate } from '@ngneat/transloco';
import dayjs, { Dayjs } from 'dayjs/esm';
import { TimePeriod } from 'ngx-daterangepicker-material/daterangepicker.component';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { Subscription, finalize, tap } from 'rxjs';
import { SiteTreeNode } from 'src/app/modules/vehicle-system/components/site-selector/interfaces/http.response';
import { TrafficParams } from 'src/app/modules/vehicle-system/interfaces/home/http.params';
import { DateKey } from 'src/app/modules/vehicle-system/interfaces/key-value-type';
import { AllResourceList, tableActionsLib } from 'src/app/modules/vehicle-system/libs/path-library';
import { MessageService } from 'src/app/modules/vehicle-system/services/common/message.service';
import { PublicModalService } from 'src/app/modules/vehicle-system/services/public-modal.service';
import { CellOperatedEvent, ColDef, ICellRendererParams, PageChangeEvent, RowClickedEvent } from "../../../../components/pagination-grid";
import { GeofenceAlertsParams } from '../../../../interfaces/alert/http.params';
import { CardViewTable, GeofenceAlert, GeofenceAlertsSearchRes } from '../../../../interfaces/alert/http.response';
import { CodesArrayItem, KeyValueType } from '../../../../interfaces/key-value-type';
import { AlertHttpRequest } from '../../../../services/alert/http.service';
import { CodeItemService } from '../../../../services/global-subscription.service';
import { MapService } from '../../../../services/map-event.service';
import { LoggerService } from '../../../../utils/logger.service';
import { AiConstLibrary } from '../../../ai-algorithm/libs/ai-const-library';

@Component({
  selector: 'vs-geofence-alerts',
  templateUrl: './geofence-alerts.component.html',
  styleUrls: ['./geofence-alerts.component.scss'],
})
export class GeofenceAlertsComponent implements OnInit, OnDestroy, OnChanges {
  @Output() addNewTaskEmit = new EventEmitter<string>();
  @Output() viewAllTaskEmit = new EventEmitter<object>();

  @Input() trafficSitesParams!: TrafficParams;
  @Input()
  set isShow(show: boolean) {
    if(show && !this.activated) {
      window.setTimeout(() => {
        this.initSearchDate();
        this.changeSearchDateForParams();
        this.searchAlert();
        this.activated = true;
      }, 200);
    }
  }

  radioList = [
    {key: 'vs.alert.leaveAlarm', value: '1'},
    {key: 'vs.alert.enterAlarm', value: '2'},
  ];

  taskLevelList: Array<CodesArrayItem> = [];
  language!: string;
  taskLevelMap: KeyValueType={};
  priorityClassMap: KeyValueType={};
  tableRowData: Array<GeofenceAlert> = [];
  totalElements=0;
  renderMode='table';
  tableColumnDefs: ColDef[] = [];
  defaultColDef: ColDef = { flex: 1 };
  currentRow={};
  searchDate: TimePeriod | null = null;
  activated = false;
  allResourceList = AllResourceList;
  autoPageSize = 20;
  searchParams: GeofenceAlertsParams={
    taskName: null,
    startDateTime: dayjs().subtract(6, 'days').startOf("day").valueOf(),
    endDateTime: dayjs().subtract(0, 'days').endOf("day").valueOf(),
    taskLevel: null,
    pageNo: 1,
    pageSize: this.autoPageSize,
    sites: [],
  };

  isShowSiteTree = false;
  siteSelectedList: Array<SiteTreeNode> = [];

  private selectTranslate$!: Subscription;
  private behavior$!: Subscription;
  private radioList$!: Subscription;

  constructor(
    private alertHttpRequest: AlertHttpRequest,
    private tl: TranslocoService,
    private loadingService: NgxUiLoaderService,
    private codeItemService: CodeItemService,
    private mapService: MapService,
    private logger: LoggerService,
    private translocoService: TranslocoService,
    private publicModalService: PublicModalService,
    private messageService: MessageService,
  ) {}


  /* Lifecycle function  -----start */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trafficSitesParams']) {
      this.changeSearchDateForParams();
      this.selectorConfirmOn(this.trafficSitesParams.sites);
    }
  }

  ngOnInit():void {
    this.transloco();
    this.initSubject();
    this.language = this.tl.getActiveLang();
    this.initTableColumnDefs();
    this.initSelectItemData();
  }

  ngOnDestroy(): void {
    this.selectTranslate$ && this.selectTranslate$.unsubscribe();
    this.behavior$ && this.behavior$.unsubscribe();
    this.radioList$ && this.behavior$.unsubscribe();

  }
  /* Lifecycle function  -----end */


  /* custom function   -----start */
  private transloco(): void {
    this.radioList.forEach(e => {
      this.radioList$ = this.translocoService.selectTranslate(e.key).subscribe(value => {
        e.key = '';
        e.key = value;
      });
    });
  }

  private initSubject(): void {
    this.behavior$ = this.alertHttpRequest.toolBoxToBusinessDateChange$.subscribe(dateParams => {
      if(dateParams.activedTab === 'geofenceList') {
        if (dateParams.startDate) {
          this.searchDate = {
            startDate: dayjs(dateParams.startDate),
            endDate: dayjs(dateParams.endDate),
          };
          this.searchParams.startDateTime = dateParams.startDate;
          this.searchParams.endDateTime = dateParams.endDate;
          this.searchAlert();
        }
      }
    });
  }

  private changeSearchDateForParams(): void {
    if(this.trafficSitesParams.startDateTime && this.trafficSitesParams.endDateTime) {
      this.searchParams.startDateTime = this.trafficSitesParams.startDateTime as number;
      this.searchParams.endDateTime = this.trafficSitesParams.endDateTime as number;
      this.searchDate = {
        startDate: dayjs(this.trafficSitesParams.startDateTime),
        endDate: dayjs(this.trafficSitesParams.endDateTime),
      };
      this.activated = false;
    }
  }

  private initSearchDate(): void {
    this.searchDate = {
      startDate: dayjs().subtract(6, 'days').startOf("day"),
      endDate: dayjs().subtract(0, 'days').endOf('day'),
    };
    this.searchParams.startDateTime = this.formatTime(this.searchDate.startDate);
    this.searchParams.endDateTime = this.formatTime(this.searchDate.endDate);
  }

  private formatTime = (date: Dayjs): number | null => {
    if (date) {
      const localTime = `${date.year()}-${date.month() + 1}-${date.date()} ${date.hour()}:${date.minute()}:${date.second()}`;
      return new Date(localTime).getTime();
    } else {
      return null;
    }
  };

  renderModeChange(): void {
    const ps = this.renderMode === 'img' ? 16 : this.autoPageSize;
    this.searchParams.pageNo = 1;
    this.searchParams.pageSize = ps;
    this.searchAlert();
  }

  initTableColumnDefs():void {
    this.initColumn();
    this.tableColumnDefs.forEach(item => {
      this.selectTranslate$ = this.tl.selectTranslate(`vs.alert.table.${item.headerName}`).subscribe(value => {
        item.headerName = value;
      });
    });
  }

  initSelectItemData():void {
    this.codeItemService.subject$.subscribe(({eventType, data}) => {
      if (eventType === 'update-codeItems') {
        data.forEach(item => {
          switch(item.codeType) {
            case 'LprTaskLevel':
              this.taskLevelList = item.codesArray;
              this.setTaskLevelMap(item.codesArray);
              break;
          }
        });
      }
    });
  }

  setTaskLevelMap(list:Array<CodesArrayItem>):void {
    list.forEach(item => {
      this.taskLevelMap[item.codeItemValue] = this.getItemName(item);
      this.priorityClassMap[item.codeItemValue] = this.getItemName(item, 'en');
    });
  }

  getItemName(data: CodesArrayItem, flag?:string):string {
    const language = flag || this.language;
    if (language === 'en') {
      return data.englishItemName;
    } else if (language === 'ar') {
      return data.arabItemName;
    }
    return '';
  }

  showSiteModal(): void {
    this.siteSelectedList = this.searchParams.sites;
    this.isShowSiteTree = true;
  }

  changeSiteSelectedList(event: Array<SiteTreeNode>): void {
    this.siteSelectedList = event;
    this.searchParams.sites = event;
  }

  // Receive the site selection modal data
  selectorConfirmOn(selectedList: SiteTreeNode[]): void {
    const copySelectedList = JSON.parse(JSON.stringify(selectedList));
    this.siteSelectedList = copySelectedList;
    this.searchParams.sites = copySelectedList;
  }

  selectedDateFn(event: DateKey):void {
    if(event.startDate && event.endDate) {
      this.searchParams.startDateTime = event.startDate;
      this.searchParams.endDateTime = event.endDate;
      this.searchDate = event.curSelected;
    }
  }

  searchAlert():void {
    this.loadingService.startLoader('geofence-alert-loader');
    const res = this.alertHttpRequest.postGeofenceAlertsSearchApi(this.searchParams);
    res.pipe(
      tap({
        error: () => {
          this.tableRowData = [];
          this.totalElements = 0;
        },
      }),
      finalize(() => {
        this.loadingService.stopLoader('geofence-alert-loader');
      }),
    ).subscribe((data:GeofenceAlertsSearchRes) => {
      if (data.result.totalElements && !data.result.content.length && this.searchParams.pageNo > 1) {
        this.searchParams.pageNo -= 1;
        this.searchAlert();
        return;
      }

      if (data.status === 200 && data.result.content) {
        this.tableRowData = data.result.content.map(item => {
          return {
            ...item,
            priorityValue: item.priority,
            priority: this.taskLevelMap[item.priority] || '',
            alertType: 'Geofence',
          };
        });
        this.totalElements = data.result.totalElements || 0;
        this.mapService.subject.next({
          eventType: 'set-alert-map-geofence-markers',
          data: {geofenceList: this.tableRowData},
        });
      } else {
        this.tableRowData = [];
        this.totalElements = 0;
      }
    });
  }

  resetParams():void {
    this.searchParams ={
      taskName: null,
      startDateTime: null,
      endDateTime: null,
      taskLevel: null,
      pageNo: 1,
      pageSize: this.renderMode === 'img' ? 16 : this.autoPageSize,
      sites: [],
    };
    this.initSearchDate();
    this.searchAlert();
  }

  onUpdateColumns(event: ColDef[]):void {
    this.tableColumnDefs = event;
  }

  onRowClicked(event: RowClickedEvent):void {
    const detail = event.data as GeofenceAlert;
    this.mapService.subject.next({
      eventType: 'set-alert-table-modal',
      data: {tableData: detail, alertPosition: this.language === 'ar' ? 'left' : 'right', alertType: 'Geofence'},
    });
  }

  checkCardItemOn(detail: CardViewTable):void {
    this.mapService.subject.next({
      eventType: 'set-alert-table-modal',
      data: {tableData: detail, alertPosition: this.language === 'ar' ? 'left' : 'right', alertType: 'Geofence'},
    });
  }

  onPageChange(event: PageChangeEvent):void {
    this.searchParams.pageNo = event.pageNumber;
    this.searchAlert();
  }

  onPageSizeChange(event: number): void {
    this.autoPageSize = event;
    this.searchParams.pageSize = this.autoPageSize;
  }

  onCellOperated(event: CellOperatedEvent):void {
    if (event.operate === AiConstLibrary.delete) {
      const data = event.rowData as unknown as {id: string | number};
      const deleteTipsInfo = translate(AiConstLibrary.deleteAlertTipsInfo);
      const text = `${deleteTipsInfo} ?`;
      this.publicModalService.showPopConirm({content: text, onOk: this.delCallBack.bind(this, data.id)});
    }
  }

  private delCallBack(id: string | number): void {
    this.loadingService.startLoader('geofence-alert-loader');
    this.alertHttpRequest.deleteGeofenceAlert(id).subscribe(
      {
        next: res => {
          this.loadingService.stopLoader('geofence-alert-loader');
          if(res.code === '0') {
            this.messageService.success(translate(AiConstLibrary.alertDeleted));
            this.searchAlert();
          } else {
            this.messageService.error(translate(AiConstLibrary.alertDeleteFailure));
          }
        },
        error: () => {
          this.messageService.error(translate(AiConstLibrary.alertDeleteFailure));
          this.loadingService.stopLoader('geofence-alert-loader');
        },
      },
    );
  }

  addNewTask():void {
    this.addNewTaskEmit.emit('geofenceList');
  }

  viewAllTask():void {
    this.viewAllTaskEmit.emit({channel: 'alert', taskValue: AiConstLibrary.geofenceList, backBtn: 'Back To Geofence Alerts'});
  }

  initColumn(): void {
    this.tableColumnDefs = [
      { field: 'id', headerName: 'alertId', minWidth: 130 },
      {
        field: 'captureDate', headerName: 'plateCapture', minWidth: 180,
        cellRenderer: (params:ICellRendererParams):string => {
          if (params.data.plateImageUrl) {
            return `<img style="width: 100px; height: 32px;" src="${ params.data.plateImageUrl }" alt=""/>`;
          } else {
            return 'No Plate';
          }
        },
      },
      {
        field: 'plateNumber', headerName: 'plateNumber', minWidth: 220, wrapText: true,
        cellRenderer: (params:ICellRendererParams):string => {
          return `${params.data.region || ''} ${params.data.category || ''} ${params.data.plateNumber || ''}`;
        },
      },
      {
        field: 'time', headerName: 'Time', minWidth: 220,
        cellRenderer: (params:ICellRendererParams):string => {
          return `<span>${dayjs(params.data.time).format('MMM D, YYYY h:mm A')}</span>`;
        },
      },
      {
        field: 'priority', headerName: 'priority', minWidth: 120,
        cellRenderer: (params:ICellRendererParams):string => {
          const priority = params.data.priority || params.data.priorityValue || '';
          return `<span class="${priority.toLocaleLowerCase()}-btn">${priority}</span>`;
        },
      },
      { field: 'siteName', headerName: 'site', minWidth: 180},
      {
        field: 'Camera', headerName: 'Camera', minWidth: 220,
        cellRenderer: (params:ICellRendererParams):string => {
          return `<span title='${params.data.cameraName || params.data.cameraId}'>${params.data.cameraName || params.data.cameraId}</span>`;
        },
      },
      {field: 'warningName', headerName: 'taskName', minWidth: 220},
      {
        field: 'actions',
        headerName: 'actions',
        type: 'actionsColumn',
        cellRendererParams: [tableActionsLib.delete, tableActionsLib.edit],
        width: 80,
      },
    ];
  }
  /* custom function   -----end */
}
