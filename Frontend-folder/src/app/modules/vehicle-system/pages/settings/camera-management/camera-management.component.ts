import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription, finalize } from 'rxjs';
import {
  CellOperatedEvent,
  ColDef,
  ICellRendererParams,
  PageChangeEvent,
  RowClickedEvent,
} from "../../../components/pagination-grid";
import { CameraInfo } from '../../../interfaces/basic-map/http.response';
import { InCameraDelete, InCameraSearch } from '../../../interfaces/camera-management/camera-management';
import { CodeItemsApi, CodesArrayItem, KeyValueType } from '../../../interfaces/key-value-type';
import { tableActionsLib } from '../../../libs/path-library';
import { CameraManagementService } from '../../../services/camera-management/camera-management.service';
import { CodeItemService } from '../../../services/global-subscription.service';

@Component({
  selector: 'vs-camera-management',
  templateUrl: './camera-management.component.html',
  styleUrls: ['./camera-management.component.scss'],
})
export class CameraManagementComponent implements OnInit, OnDestroy {
  cameraManagementList!: Array<CameraInfo>;
  currentColorTheme!: string | null;
  tableColumnDefs: ColDef[] = [];
  defaultColDef: ColDef = {};
  isShow = false;
  editModalDate!: CameraInfo;
  searchParams!: InCameraSearch;
  dataTotal = 0;
  curPageNo = 1;
  pageSize = 12;
  lang = 'en';
  isShowDetails = false;
  currentCameraInfo?:CameraInfo;
  plateColorMap: KeyValueType={};
  vehicleBrandTypeMap: KeyValueType={};
  vehicleTypeMap: KeyValueType={};
  vehicleColorMap: KeyValueType={};
  cameraSourceMap: KeyValueType={};
  mapCameraList: CameraInfo[] = [];
  isMapCameraClusterData = false;

  private siteTypeCodeList: Array<CodesArrayItem> = [];
  private selectTranslate$!: Subscription;
  private codeItemSub$!: Subscription;

  constructor(
    private translocoService: TranslocoService,
    private cameraManagementService: CameraManagementService,
    private loadingService: NgxUiLoaderService,
    private codeItemService: CodeItemService,
  ) {
  }

  ngOnInit(): void {
    this.lang = this.translocoService.getActiveLang();
    this.initSelectItemData();
  }

  // search event
  cameraSearchEvent(event: InCameraSearch): void {
    this.isMapCameraClusterData = false;
    this.searchParams = event;
    this.curPageNo = 1;
    this.cameraListSearch();
  }

  cameraListUpdateFn(cameraList: CameraInfo[]): void {
    this.isMapCameraClusterData = true;
    this.mapCameraList = cameraList;
    this.dataTotal = cameraList.length;
    this.curPageNo = 1;
    this.cameraManagementList = this.mapCameraList.slice(0, this.pageSize);
  }

  // clicked delete or edit
  methodFromParent(btnType: 'delete' | 'edit', rowData: CameraInfo): void {
    this.editModalDate = rowData;

    if (btnType === 'delete') {
      this.cameraDelete();
    } else if (btnType === 'edit') {
      this.isShow = true;
    }
  }

  closeModalEvent(): void {
    this.isShow = false;
  }

  closeCameraDetails(): void {
    this.isShowDetails = false;
  }

  // row click
  onRowClicked(event: RowClickedEvent): void {
    this.currentCameraInfo = event.data;
    this.isShowDetails = true;
  }

  onPageChange(event: PageChangeEvent): void {
    this.curPageNo = event.pageNumber;
    if (this.isMapCameraClusterData) {
      const startIndex = (this.curPageNo - 1) * this.pageSize;
      this.cameraManagementList = this.mapCameraList.slice(startIndex, startIndex + this.pageSize);
    } else {
      this.cameraListSearch();
    }
  }

  onPageSizeChange(event: number): void {
    this.pageSize = event;
  }

  onCellOperated(event: CellOperatedEvent): void {
    this.editModalDate = event.rowData as CameraInfo;

    if (event.operate === 'delete') {
      this.cameraDelete();
    } else if (event.operate === 'edit') {
      this.isShow = true;
    }
  }

  updateEmitFn(flag:boolean): void {
    if (flag) {
      this.isShow = false;
      this.cameraListSearch();
    }
  }

  private cameraListSearch(): void {
    this.loadingService.startLoader('loader-01');
    const inCameraSearch = new InCameraSearch();
    inCameraSearch.cameraName = this.searchParams.cameraName;
    inCameraSearch.license = this.searchParams.license;
    inCameraSearch.cameraStatus = this.searchParams.cameraStatus;
    inCameraSearch.sites = this.searchParams.sites;
    inCameraSearch.pageSize = this.pageSize;
    inCameraSearch.pageNo = this.curPageNo;
    this.cameraManagementService.cameraListSearch(inCameraSearch)
      .pipe(
        finalize(() => this.loadingService.stopLoader('loader-01')),
      ).subscribe(
        {
          next: res => {
            this.dataTotal = res ? res.totalElements : 0;
            this.cameraManagementList = res ? res.content : [];
          },
        },
      );
  }

  private cameraDelete(): void {
    const inCameraDelete = new InCameraDelete();
    inCameraDelete.id = this.editModalDate.id || '';
    this.cameraManagementService.cameraDelete(inCameraDelete).subscribe(
      {
        next: () => {
          this.cameraListSearch();
        },
      },
    );
  }

  private transloco(): void {
    this.initTableData();
    this.tableColumnDefs.forEach(e => {
      this.selectTranslate$ = this.translocoService.selectTranslate(`vs.cameraManagement.${e.headerName}`).subscribe(value => {
        e.headerName = value;
      });
    });
  }

  protected initSelectItemData(): void {
    this.codeItemSub$ = this.codeItemService.subject$.subscribe(
      {
        next: res => {
          this.getItemDataSuc(res.data);
          this.transloco();
        },
      },
    );
  }

  private getItemDataSuc(resultItem: Array<CodeItemsApi>): void {
    resultItem.forEach(item => {
      switch(item.codeType) {
        case 'LprPlateColor':
          this.setPlateColorMap(item.codesArray);
          break;
        case 'LprSiteType':
          this.siteTypeCodeList = item.codesArray;
          break;
        case 'LprVehicleType':
          this.setVehicleTypeMap(item.codesArray);
          break;
        case 'LprVehicleColor':
          this.setVehicleColorMap(item.codesArray);
          break;
        case 'LprCameraSource':
          this.setCameraSourceMap(item.codesArray);
          break;
        case 'LprVehicleBrandType':
          this.setVehicleBrandTypeMap(item.codesArray);
          break;
      }
    });
  }

  private setPlateColorMap(list:Array<CodesArrayItem>):void {
    list.forEach(item => {
      this.plateColorMap[item.codeItemValue] = this.getItemName(item);
    });
  }

  private setVehicleBrandTypeMap(list:Array<CodesArrayItem>):void {
    list.forEach(item => {
      this.vehicleBrandTypeMap[item.codeItemValue] = this.getItemName(item);
    });
  }

  private setVehicleTypeMap(list:Array<CodesArrayItem>):void {
    list.forEach(item => {
      this.vehicleTypeMap[item.codeItemValue] = this.getItemName(item);
    });
  }

  private setCameraSourceMap(list:Array<CodesArrayItem>):void {
    list.forEach(item => {
      this.cameraSourceMap[item.codeItemValue] = this.getItemName(item);
    });
  }

  private setVehicleColorMap(list:Array<CodesArrayItem>):void {
    list.forEach(item => {
      this.vehicleColorMap[item.codeItemValue] = this.getItemName(item);
    });
  }

  private getItemName(data: CodesArrayItem, flag?:string):string {
    const language = flag || this.lang;
    if (language === 'en') {
      return data.englishItemName;
    } else if (language === 'ar') {
      return data.arabItemName;
    }
    return '';
  }

  private initTableData(): void {
    this.tableColumnDefs = [
      { field: 'cameraName', headerName: 'cameraName', flex: 1.2, wrapText: true},
      // { field: 'cameraId', headerName: 'cameraId', tooltipField: 'cameraId', flex: 1.3, wrapText: true},
      { field: 'nvmsId', headerName: 'NVMSID', tooltipField: 'nvmsId', flex: 1.8, wrapText: true},
      { field: 'siteName', headerName: 'site', flex: 1, wrapText: true},
      {
        field: 'siteType', headerName: 'siteType', flex: 1, wrapText: true,
        cellRenderer: (params: ICellRendererParams): string => {
          const item = this.siteTypeCodeList.find(item => params.data.siteType === item.codeItemValue);
          return this.lang === 'ar' ? item?.arabItemName || '' : item?.englishItemName || '';
        },
      },
      { field: 'longitude', headerName: 'longitude', flex: 1, wrapText: true},
      { field: 'latitude', headerName: 'latitude', flex: 1, wrapText: true},
      { field: 'cameraStatus', headerName: 'cameraStatus', flex: 1, wrapText: true},
      { field: 'license', headerName: 'license', flex: 1, wrapText: true},
      {
        field: 'actions',
        headerName: 'actions',
        type: 'actionsColumn',
        cellRendererParams: [tableActionsLib.edit, tableActionsLib.delete],
        flex: 0.8,
      },
    ];
  }

  ngOnDestroy(): void {
    this.codeItemSub$.unsubscribe();
    this.selectTranslate$.unsubscribe();
  }
}
