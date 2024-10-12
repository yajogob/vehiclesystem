import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  RowClickedEvent,
  RowStyle,
  SortChangedEvent,
  SortDirection,
} from "ag-grid-community";
import { AllResourceListType, TRAFFICMenuList } from '../../interfaces/rbac';
import { AllResourceList } from '../../libs/path-library';
import { DIRECTION, I18nService } from "../../utils/i18n.service";
import { SwitchButtonRendererComponent } from '../switch-button-renderer/switch-button-renderer.component';
import { TableActionsRendererComponent } from '../table-actions-renderer/table-actions-renderer.component';
import { NoRowsOverlayComponent } from "./no-rows-overlay/no-rows-overlay.component";
import { PageChangeEvent } from "./pagination/pagination.component";

export interface CellOperatedEvent {
  rowData: NonNullable<unknown>,
  operate: string;
}

export interface SortChangeEvent {
  order: string | undefined | null,
  sort: string
}

export interface SwitchChangedEvent {
  field: string,
  switchValue: boolean;
  rowData: NonNullable<unknown>,
}

@Component({
  selector: 'vs-pagination-grid',
  templateUrl: './pagination-grid.component.html',
  styleUrls: ['./pagination-grid.component.scss'],
})
export class PaginationGridComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() columnDefs: ColDef[] = [];
  @Input() totalItems = 0;
  @Input() suppressRowClickSelection = false;

  @Input() itemsPerPage = 10;
  @Input() currentPage = 1;
  @Input() sortingOrder: SortDirection[] = ['desc', 'asc'];
  @Input() id = "defaultId";
  @Input() alwaysShowPageNumber?: boolean;
  @Input() pageMode: 'server'|'client' = 'server';
  @Input() rowData!: NonNullable<unknown>[];
  @Input() switchHeight = false;

  @Input()
  set defaultColDef(def:ColDef) {
    this._defaultColDef = {...def, comparator: () : number => 0};
  }

  get defaultColDef() : ColDef {
    return this._defaultColDef;
  }

  @ViewChild('customTable') tableDom: ElementRef | undefined;
  @Output() gridReady: EventEmitter<GridReadyEvent> = new EventEmitter<GridReadyEvent>();
  @Output() rowClicked: EventEmitter<RowClickedEvent> = new EventEmitter<RowClickedEvent>();
  @Output() pageChange: EventEmitter<PageChangeEvent> = new EventEmitter<PageChangeEvent>();
  @Output() cellOperated: EventEmitter<CellOperatedEvent> = new EventEmitter<CellOperatedEvent>();
  @Output() switchchanged: EventEmitter<SwitchChangedEvent> = new EventEmitter<SwitchChangedEvent>();
  @Output() sortChanged: EventEmitter<SortChangeEvent> = new EventEmitter<SortChangeEvent>();
  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() totalChange: EventEmitter<number> = new EventEmitter<number>();

  context!: NonNullable<unknown>;
  enableRtl = false;
  columnTypes!: { [key: string]: ColDef; };
  heightValue = {};
  allResourceList: AllResourceListType = AllResourceList;
  autoPageSize = 20;

  private _rowData : NonNullable<unknown>[] = [];
  private gridApi!: GridApi;
  private sorted = false;
  private pageChanged = false;
  private _defaultColDef! : ColDef;

  constructor(private i18nService: I18nService) {
    this.context = {componentParent: this};
    this.enableRtl = this.i18nService.getDirection() === DIRECTION.RTL;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.countPageComHeight();
    this.accessControlHandle();

    if(changes['totalItems']) {
      const currentValue = changes['totalItems'].currentValue;
      this.totalItems = currentValue < 10000 ? currentValue : 10000;
      this.totalChange.emit(this.totalItems);
    }
  }

  ngOnInit(): void {
    this.columnTypes = {
      actionsColumn: {cellRenderer: TableActionsRendererComponent},
      switchColumn: {cellRenderer: SwitchButtonRendererComponent},
    };

    window.addEventListener('resize', () => {
      this.countPageComHeight();
      this.initPageSize();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initPageSize();
    }, 500);
  }


  initPageSize(): void {
    const tableDom = this.tableDom?.nativeElement || {};
    if (tableDom.clientHeight > 70) {
      const htmlFontSize = document.querySelector('html')?.style.fontSize;
      const pageHeight = Number(htmlFontSize?.replace('px', '')) * 4;
      const autoPageSize = Math.floor((tableDom.clientHeight - pageHeight) / 62);
      this.autoPageSize = autoPageSize;
      this.pageSizeChange.emit(this.autoPageSize);
    } else {
      setTimeout(() => {
        this.initPageSize();
      }, 200);
    }
  }

  // table clicked delete or edit
  actionCallback(btnType: string, rowData: NonNullable<unknown>): void {
    this.cellOperated.emit({operate: btnType, rowData});
  }

  switchCallback(field: string, switchValue: boolean, rowData: NonNullable<unknown>): void {
    this.switchchanged.emit({field, switchValue, rowData});
  }

  getRowStyle = (): RowStyle => {
    if (!this.suppressRowClickSelection) {
      return {cursor: 'pointer'};
    }
    return {cursor: 'auto'};
  };

  onGridReady(params: GridReadyEvent): void {
    this.countPageComHeight();
    this.gridApi = params.api;
    this.gridReady.emit(params);
  }


  onRowClicked(event: RowClickedEvent): void {
    this.rowClicked.emit(event);
  }

  onPageChange(event: PageChangeEvent): void {
    this.pageChanged = true;
    this.currentPage = event.pageNumber;
    if(this.pageMode === 'client') {
      this.gridApi.paginationGoToPage(event.pageNumber);
    } else {
      this.pageChange.emit(event);
    }
  }

  onSortChanged(event: SortChangedEvent): void {
    const state = event.columnApi?.getColumnState()?.find(state => {return state.sort != null;});
    if(state) {
      this.sorted = true;
      this.sortChanged.emit({order: state.sort, sort: state.colId});
    }
  }

  private accessControlHandle(): void {
    const meunListRes = JSON.parse(localStorage.getItem('menuList') || '[]');
    const haveAccessMap: Array<string> = [];
    const actionsItem = this.columnDefs.find(item => item.field === 'actions');
    if(actionsItem) {
      if(actionsItem.cellRendererParams && actionsItem.cellRendererParams.length > 0) {
        actionsItem.cellRendererParams.forEach((item: string) => {
          meunListRes.forEach((ele: TRAFFICMenuList) => {
            if(ele.uriSet === this.allResourceList[`${this.id}_${item}` as keyof AllResourceListType]) {
              haveAccessMap.push(item);
            }
          });
        });

        if(haveAccessMap.length === 0) {
          const index = this.columnDefs.findIndex(item => item.field === 'actions');
          this.columnDefs.splice(index, 1);
        } else {
          this.columnDefs.forEach(item => {
            if(item.field === 'actions') {
              item.cellRendererParams = haveAccessMap;
            }
          });
        }
      }
    }
  }

  private countPageComHeight(): void {
    if(this.switchHeight) {
      // setTimeout(() => {
      //   const row = document.getElementsByClassName('ag-row');
      //   const header = document.getElementsByClassName('ag-header-row');
      //   if(row.length > 0 && header.length > 0) {
      //     const rowDom = row[0] as HTMLElement;
      //     const headerDom = header[0] as HTMLElement;
      //     const value = rowDom.offsetHeight * this.itemsPerPage + headerDom.offsetHeight + 5;
      //     this.heightValue = {height: `${value}px`, flex: 'none'};
      //   }
      // }, 100);
    }
  }

  columnBorderHandle(): void {
    // Not useful at the moment
    const domList = this.tableDom?.nativeElement.querySelectorAll('.ag-theme-alpine .ag-row .ag-cell');

    if(domList && domList.length) {
      domList.forEach((item: Element) => {
        const l = (item as HTMLElement).style.left;
        (item as HTMLElement).style.left = parseInt(l) + 1 + 'px';
      });
    }
  }

  protected readonly NoRowsOverlayComponent = NoRowsOverlayComponent;
}
