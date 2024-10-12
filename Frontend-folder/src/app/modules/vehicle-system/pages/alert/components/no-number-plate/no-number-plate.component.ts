import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { TranslocoService, translate } from '@ngneat/transloco';
import { ColDef, ICellRendererParams, RowClickedEvent } from 'ag-grid-community';
import dayjs, { Dayjs } from 'dayjs/esm';
import { TimePeriod } from 'ngx-daterangepicker-material/daterangepicker.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription, finalize } from 'rxjs';
import { CellOperatedEvent, PageChangeEvent } from 'src/app/modules/vehicle-system/components/pagination-grid';
import { SortChangeEvent } from 'src/app/modules/vehicle-system/components/pagination-grid/pagination-grid.component';
import { SiteTreeNode } from 'src/app/modules/vehicle-system/components/site-selector/interfaces/http.response';
import { FcMapType, FcType } from 'src/app/modules/vehicle-system/interfaces/ai-algorithm/ai-algorithm';
import { InNoNumberPlate, OutNoNumberPlateList } from 'src/app/modules/vehicle-system/interfaces/alert/http.params';
import { CardViewTable } from 'src/app/modules/vehicle-system/interfaces/alert/http.response';
import { TrafficParams } from 'src/app/modules/vehicle-system/interfaces/home/http.params';
import { CodeItemsApi, CodesArrayItem, DateKey } from 'src/app/modules/vehicle-system/interfaces/key-value-type';
import { tableActionsLib } from 'src/app/modules/vehicle-system/libs/path-library';
import { AlertHttpRequest } from 'src/app/modules/vehicle-system/services/alert/http.service';
import { MessageService } from 'src/app/modules/vehicle-system/services/common/message.service';
import { CodeItemService } from 'src/app/modules/vehicle-system/services/global-subscription.service';
import { MapService } from 'src/app/modules/vehicle-system/services/map-event.service';
import { PublicModalService } from 'src/app/modules/vehicle-system/services/public-modal.service';
import { AiConstLibrary } from '../../../ai-algorithm/libs/ai-const-library';

@Component({
  selector: 'vs-no-number-plate',
  templateUrl: './no-number-plate.component.html',
  styleUrls: ['./no-number-plate.component.scss'],
})
export class NoNumberPlateComponent implements OnInit, OnDestroy, OnChanges {
  @Input() trafficSitesParams!: TrafficParams;
  @Input()
  set isShow(show: boolean) {
    if(show && !this.activated) {
      window.setTimeout(() => {
        this.initSearchDate();
        this.changeSearchDateForParams();
        this.searchTableList();
        this.activated = true;
      }, 200);
    }
  }

  activeLangValue!: string;
  tableRowData: Array<OutNoNumberPlateList> = [];
  totalElements = 0;
  tableColumnDefs: ColDef[] = [];
  defaultColDef: ColDef = {wrapText: true};
  renderMode = 'table';

  searchDate: TimePeriod | null = {
    startDate: dayjs().subtract(6, 'days').startOf("day"),
    endDate: dayjs().subtract(0, 'days').endOf('day'),
  };

  isShowSiteTree = false;
  siteSelectedList: Array<SiteTreeNode> = [];


  autoPageSize = 20;
  searchParams: InNoNumberPlate = {
    startDateTime: dayjs().subtract(6, 'days').startOf("day").valueOf(),
    endDateTime: dayjs().subtract(0, 'days').endOf('day').valueOf(),
    pageNo: 1,
    pageSize: this.autoPageSize,
    sites: [],
  };

  private vehicleColorList: Array<{ key: string, value: string }> = [];
  private vehicleMakeList: Array<{ key: string, value: string }> = [];
  private vehicleModelList: Array<{ key: string, value: string }> = [];
  private codeDictList!: Array<CodeItemsApi>; // Code dictionary list
  private behavior$!: Subscription;
  private selectTranslate$!: Subscription;
  private activated = false;
  private codeItemFuncMap!: FcMapType;

  constructor(
    private alertHttpRequest: AlertHttpRequest,
    private translocoService: TranslocoService,
    private loadingService: NgxUiLoaderService,
    private mapService: MapService,
    private publicModalService: PublicModalService,
    private messageService: MessageService,
    private codeItemService: CodeItemService,
  ) {}

  ngOnInit(): void {
    this.activeLangValue = this.translocoService.getActiveLang();
    this.initParamsDate();
    this.initSubject();
    this.initTableColumnDefs();
    this.setCodeItem();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trafficSitesParams']) {
      this.changeSearchDateForParams();
      this.selectorConfirmOn(this.trafficSitesParams.sites);
    }
  }

  ngOnDestroy(): void {
    this.selectTranslate$ && this.selectTranslate$.unsubscribe();
    this.behavior$ && this.behavior$.unsubscribe();
  }

  searchTableList(): void {
    this.searchParams.pageNo = 1;
    this.getTableList();
  }

  resetForm(): void {
    this.siteSelectedList = [];
    this.searchDate = null;
    this.searchParams = new InNoNumberPlate();
    this.searchParams.sites = [];
    this.searchParams.pageNo = 1;
    this.searchParams.pageSize = this.renderMode === 'img' ? 16 : this.autoPageSize;
    this.initSearchDate();
    this.searchTableList();
  }

  selectedDateFn(event: DateKey):void {
    if(event.startDate && event.endDate) {
      this.searchParams.startDateTime = event.startDate;
      this.searchParams.endDateTime = event.endDate;
      this.searchDate = event.curSelected;
    }
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

  onUpdateColumns(event: ColDef[]):void {
    this.tableColumnDefs = event;
  }

  onRowClicked(event: RowClickedEvent):void {
    const detail = event.data as OutNoNumberPlateList;
    this.mapService.subject.next({
      eventType: 'set-alert-table-modal',
      data: {tableData: detail, alertPosition: this.activeLangValue === 'ar' ? 'left' : 'right', alertType: 'NoNumberPlate'},
    });
  }

  checkCardItemOn(detail: CardViewTable):void {
    this.mapService.subject.next({
      eventType: 'set-alert-table-modal',
      data: {tableData: detail, alertPosition: this.activeLangValue === 'ar' ? 'left' : 'right', alertType: 'NoNumberPlate'},
    });
  }

  renderModeChange(): void {
    const ps = this.renderMode === 'img' ? 16 : this.autoPageSize;
    this.searchParams.pageNo = 1;
    this.searchParams.pageSize = ps;
    this.searchTableList();
  }

  onPageChange(event: PageChangeEvent):void {
    this.searchParams.pageNo = event.pageNumber;
    this.getTableList();
  }

  onPageSizeChange(event: number): void {
    this.autoPageSize = event;
    this.searchParams.pageSize = this.autoPageSize;
  }

  onCellOperated(event: CellOperatedEvent):void {
    if (event.operate === AiConstLibrary.delete) {
      const data = event.rowData as unknown as {motorVehicleID: string};
      const deleteTipsInfo = translate(AiConstLibrary.deleteAlertTipsInfo);
      const text = `${deleteTipsInfo} ?`;
      this.publicModalService.showPopConirm({content: text, onOk: this.delCallBack.bind(this, data.motorVehicleID)});
    }
  }

  onSortChanged(event: SortChangeEvent): void {
    this.searchParams.dir = event.order ? event.order : 'desc';
    this.searchTableList();
  }

  private delCallBack(motorVehicleID: string): void {
    this.loadingService.startLoader('no-number-plate-loader');
    this.alertHttpRequest.deleteNoNumberPlate(motorVehicleID).subscribe(
      {
        next: res => {
          if(res.code === '0') {
            this.messageService.success(translate(AiConstLibrary.recordDeleted));
            setTimeout(() => {
              this.getTableList();
              this.loadingService.stopLoader('no-number-plate-loader');
            }, 2000);
          } else {
            this.messageService.error(translate(AiConstLibrary.taskDeleteFailure));
            this.loadingService.stopLoader('no-number-plate-loader');
          }
        },
        error: () => {
          this.messageService.error(translate(AiConstLibrary.taskDeleteFailure));
          this.loadingService.stopLoader('no-number-plate-loader');
        },
      },
    );
  }

  private getTableList(): void {
    this.loadingService.startLoader('no-number-plate-loader');
    this.alertHttpRequest.searchNoNumberPlate(this.searchParams).pipe(
      finalize(() => {
        this.loadingService.stopLoader('no-number-plate-loader');
      }),
    ).subscribe(
      {
        next: res => {
          if (res.result.totalElements && !res.result.content.length && this.searchParams.pageNo > 1) {
            this.searchParams.pageNo -= 1;
            this.getTableList();
            return;
          }

          if(res.status === 200 && res.result.content) {
            res.result.content.forEach(item => {
              if(item.vehicleMake) {
                const vehicleMakeKey = `LprVehicleBrandType_${ item.vehicleMake }`;
                this.codeDictList.forEach(ele => {
                  if (ele.codeType === vehicleMakeKey) {
                    this.vehicleModelList = this.codesArrayForEach(ele.codesArray);
                  }
                  item.vehicleModelDesc = this.vehicleModelList?.find(el => el.value === item.vehicleModel)?.key;
                });
                item.vehicleColorDesc = this.vehicleColorList.find(el => el.value === item.vehicleColor)?.key;
                item.vehicleMakeDesc = this.vehicleMakeList.find(el => el.value === item.vehicleMake)?.key;
              }
            });
            this.tableRowData = res.result.content;
            this.totalElements = res.result.totalElements || 0;
          }
        },
        error: () => {
          this.loadingService.stopLoader('no-number-plate-loader');
        },
      },
    );
  }

  private initSubject(): void {
    this.behavior$ = this.alertHttpRequest.toolBoxToBusinessDateChange$.subscribe(dateParams => {
      if(dateParams.activedTab === 'noNumberPlate') {
        if (dateParams.startDate) {
          this.searchDate = {
            startDate: dayjs(dateParams.startDate),
            endDate: dayjs(dateParams.endDate),
          };
          this.searchParams.startDateTime = dateParams.startDate;
          this.searchParams.endDateTime = dateParams.endDate;
          this.searchTableList();
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

  private initTableColumnDefs():void {
    this.initColumn();
    this.tableColumnDefs.forEach(item => {
      this.selectTranslate$ = this.translocoService.selectTranslate(`vs.alert.table.${item.headerName}`).subscribe(value => {
        item.headerName = value;
      });
    });
  }

  private setCodeItem(): void {
    this.codeItemFuncMap = {
      'LprVehicleColor': this.lprVehicleColorFunc.bind(this),
      'LprVehicleBrandType': this.lprVehicleBrandTypeFunc.bind(this),
    };
    this.initSelectItemData();
  }

  private lprVehicleColorFunc(codesArray: Array<CodesArrayItem>): void {
    this.vehicleColorList = this.codesArrayForEach(codesArray);
  }

  private lprVehicleBrandTypeFunc(codesArray: Array<CodesArrayItem>): void {
    this.vehicleMakeList = this.codesArrayForEach(codesArray);
  }

  private initSelectItemData():void {
    this.codeItemService.subject$.subscribe(({eventType, data}) => {
      if (eventType === 'update-codeItems') {
        this.codeDictList = data;
        this.getCodeItemSuc(data);
      }
    });
  }

  private getCodeItemSuc(resultItem: Array<CodeItemsApi>): void {
    resultItem.forEach(item => {
      const fn = this.codeItemFuncMap[item.codeType as keyof FcMapType] as FcType | undefined;
      if (fn) fn(item.codesArray);
    });
  }

  private codesArrayForEach(codesArray: Array<CodesArrayItem>): Array<{ key: string, value: string }> {
    const list: Array<{ key: string, value: string }> = [];
    codesArray.forEach(item => {
      const key = this.activeLangValue === 'ar' ? item.arabItemName : item.englishItemName;
      const kvObj = { key, value: item.codeItemValue };
      list.push(kvObj);
    });
    return list;
  }

  private initColumn(): void {
    this.tableColumnDefs = [
      {
        field: 'cameraName', headerName: 'cameraName', flex: 1, cellRenderer: (params:ICellRendererParams):string => {
          return `<span title='${params.data.cameraName}'>${params.data.cameraName}</span>`;
        },
      },
      { field: 'siteName', headerName: 'siteName', flex: 1},
      {
        field: 'captureTime', headerName: 'captureTime', sortable: true, sort: 'desc', flex: 1, cellRenderer: (params:ICellRendererParams):string => {
          const date = dayjs(Number(params.data.captureTime)).format('MMM D, YYYY');
          const time = dayjs(Number(params.data.captureTime)).format('h:mm A');
          return `<div style="display: flex">
                    <div>
                      <span>${date}</span>
                      <br/>
                      <span>${time}</span>
                    </div>
                  </div>`;
        },
      },
      {
        field: 'vehicleColor', headerName: 'vehicleColor', hide: true, flex: 1,
        cellRenderer: (params: ICellRendererParams): string => {
          let color;
          if(params.value) {
            color = params.value.slice(0,1).toLocaleUpperCase() + params.value.slice(1);
          }
          return color;
        },
      },
      {
        field: 'vehicleMake', headerName: 'vehicleMake', wrapText: true, hide: true, flex: 1,
        cellRenderer: (params: ICellRendererParams): string => {
          return `<span class="line-clamp-2" title="${ params.value || '' }">${ params.value || '' }</span>`;
        },
      },
      {
        field: 'vehicleModel', headerName: 'vehicleModel', wrapText: true, hide: true, flex: 1,
        cellRenderer: (params: ICellRendererParams): string => {
          return `<span class="line-clamp-2" title="${ params.value || '' }">${ params.value || '' }</span>`;
        },
      },
      { field: 'speed', headerName: 'estimatedSpeed', hide: true, flex: 1},
      {
        field: 'actions',
        headerName: 'actions',
        type: 'actionsColumn',
        cellRendererParams: [tableActionsLib.delete],
        width: 120,
      },
    ];
  }

  private initParamsDate(): void {
    this.searchParams.startDateTime = dayjs().subtract(6, 'days').startOf("day").valueOf();
    this.searchParams.endDateTime = dayjs().valueOf();
  }
}
