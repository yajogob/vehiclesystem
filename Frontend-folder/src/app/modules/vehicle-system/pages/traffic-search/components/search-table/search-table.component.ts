import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { ICellRendererParams } from 'ag-grid-community';
import dayjs from 'dayjs/esm';
import { Subscription } from 'rxjs';
import { CodeItemsApi, CodesArrayItem, KeyValueType } from 'src/app/modules/vehicle-system/interfaces/key-value-type';
import { TRAFFICMenuList } from 'src/app/modules/vehicle-system/interfaces/rbac';
import { AllResourceList, PathLib } from 'src/app/modules/vehicle-system/libs/path-library';
import { CodeItemService } from 'src/app/modules/vehicle-system/services/global-subscription.service';
import { I18nService } from 'src/app/modules/vehicle-system/utils/i18n.service';
import { ColDef, PageChangeEvent, RowClickedEvent } from '../../../../components/pagination-grid';
import { SortChangeEvent } from '../../../../components/pagination-grid/pagination-grid.component';
import {
  CodeItemType,
  TrafficSearchItem,
  TrafficSearchList,
  TrafficSearchListParams,
  TrafficSearchTableConditionsChange,
  codeItemMapType,
} from '../../../../interfaces/traffic-search/traffic-search';
import { RouterService } from '../../../../services/router.service';
import { TrafficSearchStorageService } from '../../../../services/traffic-search/traffic-search-storage.service';
import { addSeparatorToNumber } from '../../../../utils/tool';
import { TrafficSearchConstLibrary } from '../../libs/traffic-search-const-library';

@Component({
  selector: 'vs-search-table',
  templateUrl: './search-table.component.html',
  styleUrls: [ './search-table.component.scss' ],
})

export class SearchTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() trafficSearchTableListInfo!: TrafficSearchList | null;
  @Input() trafficSearchParams = new TrafficSearchListParams();
  @Output() getTrafficSearchListEmit: EventEmitter<TrafficSearchTableConditionsChange> = new EventEmitter<TrafficSearchTableConditionsChange>();
  @Output() destroyLoaderEmit: EventEmitter<void> = new EventEmitter<void>();
  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();

  tableColumnDefs: ColDef[] = [];
  defaultColDef: ColDef = {};
  totalPages!: number;
  totalElements!: string;
  trafficSearchList!: TrafficSearchItem[];
  pageShow = false;
  codeDictList!: Array<CodeItemsApi>; // Code dictionary list
  activeLangValue!: string;
  plateColorList: Array<KeyValueType> = []; // Plate color
  allResourceList = AllResourceList;

  private selectTranslate$!: Subscription;

  constructor(
    private translocoService: TranslocoService,
    private routerService: RouterService,
    private codeItemService: CodeItemService,
    private i18nService: I18nService,
    private trafficSearchStorageService: TrafficSearchStorageService,
  ) {
  }

  ngOnChanges(): void {
    this.trafficSearchList = this.trafficSearchTableListInfo?.content || [];
    this.totalPages = this.trafficSearchTableListInfo?.totalPages || 0;
    const totalElements = this.trafficSearchTableListInfo?.totalElements || 0;
    this.totalElements = addSeparatorToNumber(totalElements);
  }

  ngOnInit(): void {
    this.activeLangValue = this.i18nService.getLanguage();
    this.i18nService.getLanguageObservable().subscribe(lang => {
      this.activeLangValue = lang;
    });
    this.codeItemService.subject$.subscribe({
      next: res => {
        this.codeDictList = res.data;
        this.getCodeItemSuc(res.data);
      },
    });
    this.initTableData();
  }

  ngOnDestroy(): void {
    this.selectTranslate$?.unsubscribe();
  }

  /* ---------------------- methods ---------------------- */
  private codeItemFuncMap: codeItemMapType = { 'LprPlateColor': this.lprPlateColorFunc.bind(this) };

  private getCodeItemSuc(resultItem: Array<CodeItemsApi>): void {
    resultItem.forEach(item => {
      const fn = this.codeItemFuncMap[item.codeType as keyof codeItemMapType] as CodeItemType | undefined;
      fn && fn(item.codesArray);
    });
  }

  private lprPlateColorFunc(codesArray: Array<CodesArrayItem>): void {
    this.plateColorList = this.codesArrayForEach(codesArray, 'en');
  }

  private codesArrayForEach(codesArray: Array<CodesArrayItem>, lang?:string): Array<KeyValueType> {
    const list: Array<KeyValueType> = [];
    codesArray.forEach(item => {
      const key = (lang || this.activeLangValue) === 'ar' ? item.arabItemName : item.englishItemName;
      const kvObj = { key, value: item.codeItemValue };
      list.push(kvObj);
    });
    return list;
  }

  onSortChanged(event: SortChangeEvent): void {
    const params: TrafficSearchTableConditionsChange = {
      type: 'sort',
      data: event.order ? event.order : 'desc',
    };
    this.getTrafficSearchListEmit.emit(params);
  }

  accessHandle = (accessName: string): boolean => {
    const meunListRes = JSON.parse(localStorage.getItem('menuList') || '[]');
    const accessParams = accessName || '';
    const next = meunListRes.some((item: TRAFFICMenuList) => {
      return item.uriSet.includes(accessParams);
    });
    return next;
  };

  onRowClicked(event: RowClickedEvent): void {
    if (!this.accessHandle(this.allResourceList.VehicleProfileOwner)) return;
    const originalRegion = event.data.originalRegion || '';
    const plateColorList = [];
    for (let i = 0; i < this.plateColorList.length; i++) {
      const element = this.plateColorList[i];
      if (event.data.plateColor === element['key']) {
        plateColorList.push(element['value']);
        break;
      }
    }
    const detailMsg:TrafficSearchItem = {
      ...event.data,
      plateColorList,
      region: originalRegion,
      endDateTime: this.trafficSearchParams.endDateTime,
      startDateTime: this.trafficSearchParams.startDateTime,
    };

    this.trafficSearchStorageService.commonAccess(TrafficSearchConstLibrary.CURRENT_TRAFFIC_SEARCH_DATA, detailMsg);
    const navigationExtras: NavigationExtras = { queryParams: { id: TrafficSearchConstLibrary.CURRENT_TRAFFIC_SEARCH_DATA } };
    this.routerService.navigate([ PathLib.VEHICLE_PROFILE ], navigationExtras);
  }

  onPageChange(event: PageChangeEvent): void {
    const params: TrafficSearchTableConditionsChange = {
      type: 'page',
      data: event.pageNumber,
    };
    this.getTrafficSearchListEmit.emit(params);
  }

  onPageSizeChange(event: number): void {
    this.pageSizeChange.emit(event);
  }

  onUpdateColumns(event: ColDef[]): void {
    this.tableColumnDefs = event;
  }

  /* ---------------------- private methods ---------------------- */

  private initTableData(): void {
    this.tableColumnDefs = [
      {
        field: 'plateImage', headerName: 'plateImage', flex: 1,
        cellRenderer: (params: ICellRendererParams): string => {
          return `<img style="width: 100px; height: 32px;" src="${ params.data.plateImage }" alt=""/>`;
        },
      },
      {
        field: 'region', headerName: 'plateRegion', wrapText: true, flex: 0.7,
        cellRenderer: (params: ICellRendererParams): string => {
          return `<span class="line-clamp-2" title="${ params.data.region || '' }">${ params.data.region || '' }</span>`;
        },
      },
      {
        field: 'category', headerName: 'plateCategory', wrapText: true, flex: 0.8,
        cellRenderer: (params: ICellRendererParams): string => {
          return `<span class="line-clamp-2" title="${ params.data.category || '' }">${ params.data.category || '' }</span>`;
        },
      },
      {
        field: 'plateNumber', headerName: 'plateNumber', wrapText: true, flex: 0.6,
        cellRenderer: (params: ICellRendererParams): string => {
          return `<span class="line-clamp-2" title="${ params.data.plateNumber || '' }">${ params.data.plateNumber || '' }</span>`;
        },
      },
      { field: 'plateColor', headerName: 'plateColor', flex: 0.7},
      {
        field: 'captureTime', headerName: 'captureTime', sortable: true, sort: 'desc', wrapText: true, flex: 1.3,
        cellRenderer: (params: ICellRendererParams): string => {
          return `<span>${ dayjs(Number(params.data.captureTime)).format('MMM D, YYYY h:mm A') }</span>`;
        },
      },
      {
        field: 'cameraName', headerName: 'cameraName', wrapText: true, flex: 1,
        cellRenderer: (params: ICellRendererParams): string => {
          return `<span class="line-clamp-2" title="${ params.data.cameraName || '' }">${ params.data.cameraName || '' }</span>`;
        },
      },
      {
        field: 'siteName', headerName: 'siteName', wrapText: true, flex: 1,
        cellRenderer: (params: ICellRendererParams): string => {
          return `<span class="line-clamp-2" title="${ params.data.siteName || '' }">${ params.data.siteName || '' }</span>`;
        },
      },
      {
        field: 'vehicleMake', headerName: 'vehicleMake', wrapText: true, hide: true, flex: 1,
        cellRenderer: (params: ICellRendererParams): string => {
          return `<span class="line-clamp-2" title="${ params.data.vehicleMake || '' }">${ params.data.vehicleMake || '' }</span>`;
        },
      },
      {
        field: 'vehicleModel', headerName: 'vehicleModel', wrapText: true, hide: true, flex: 1,
        cellRenderer: (params: ICellRendererParams): string => {
          return `<span class="line-clamp-2" title="${ params.data.vehicleModel || '' }">${ params.data.vehicleModel || '' }</span>`;
        },
      },
      {
        field: 'vehicleColor', headerName: 'vehicleColor', hide: true, flex: 1,
        cellRenderer: (params: ICellRendererParams): string => {
          return `<span>${ params.data.vehicleColor || '' }</span>`;
        },
      },
      { field: 'speed', headerName: 'estimatedSpeed', hide: true, flex: 1},
    ];
    this.transloco();
  }

  private transloco(): void {
    this.tableColumnDefs.forEach(e => {
      this.selectTranslate$ = this.translocoService.selectTranslate(`vs.trafficSearch.${ e.headerName }`).subscribe(value => {
        e.headerName = value;
      });
    });
    setTimeout(() => {
      this.pageShow = true;
    }, 400);
  }
}
