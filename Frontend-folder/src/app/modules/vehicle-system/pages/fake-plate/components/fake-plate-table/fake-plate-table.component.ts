import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ThemeService } from '@core/services/theme.service';
// import { Theme } from '@enums/theme'
import { TranslocoService } from '@ngneat/transloco';
import { ICellRendererParams } from 'ag-grid-community';
import dayjs from 'dayjs/esm';
import { Subscription } from 'rxjs';
import { tableActionsLib } from 'src/app/modules/vehicle-system/libs/path-library';
import { CellOperatedEvent, ColDef, PageChangeEvent } from '../../../../components/pagination-grid';
import { FakePlateSearchItem, LayerInfoResponse, fakePlateTableConditionsChange } from '../../../../interfaces/fake-plate/fake-plate';

@Component({
  selector: 'vs-fake-plate-table',
  templateUrl: './fake-plate-table.component.html',
  styleUrls: [ './fake-plate-table.component.scss' ],
})
export class FakePlateTableComponent implements OnInit, OnDestroy {
  @Input() totalElements!: number;
  @Input() currentPage = 1;

  @Input() searchTableInfo!: Array<FakePlateSearchItem>;
  @Output() openDrawerEmit = new EventEmitter<boolean>();
  @Output() getLayerInfoEmit = new EventEmitter<LayerInfoResponse>();
  @Output()
    getFakePlateTableListEmit: EventEmitter<fakePlateTableConditionsChange> =
      new EventEmitter<fakePlateTableConditionsChange>();

  pageNo!: number;
  tableColumnDefs: ColDef[] = [];

  private selectTranslate$!: Subscription;
  // private theme: Theme = Theme.LIGHT

  /*  private isLight = true
    private colorLight = '#816d06'
    private coloDark = '#E0D182'*/

  constructor(private translocoService: TranslocoService, private themeService: ThemeService) {
  }

  private initTableData(): void {
    this.tableColumnDefs = [
      {
        field: 'plateNumber', headerName: 'plateNumber', flex: 1,
        cellRenderer: (params: ICellRendererParams): string => {
          return `${params.data.region || ''} ${params.data.plateType || ''} ${params.data.plateNumber || ''}`;
        },
      },
      {
        field: 'lastRecordTime', headerName: 'lastRecordTime', flex: 1, cellRenderer: (params: ICellRendererParams): string => {
          return `<span>${ dayjs(params.value).format('MMM D, YYYY h:mm A') }</span>`;
        },
      },
      { field: 'searchType', headerName: 'searchType', width: 400 },
      {
        field: 'currentStatus',
        headerName: 'currentStatus',
        flex: 1,
        cellStyle: (
          params,
        ): {
          color: string;
        } | null => {
          if (params.value === 'Unconfirmed') return { color: '#888888' };
          if (params.value === 'Fake Plate Number') return { color: '#E71D36' };
          if (params.value === 'Verified') return { color: '#03DB59' };
          return null;
        },
      },
      {
        field: 'actions',
        headerName: 'actions',
        type: 'actionsColumn',
        cellRendererParams: [ tableActionsLib.details ],
        width: 120,
      },
    ];
  }

  private transloco(): void {
    this.tableColumnDefs.forEach(e => {
      this.selectTranslate$ = this.translocoService
        .selectTranslate(`vs.fakePlateNumber.${ e.headerName }`)
        .subscribe(value => {
          e.headerName = value;
        });
    });
  }

  ngOnInit(): void {
    /* this.theme = this.themeService.getColorTheme()
     this.isLight = this.theme == Theme.LIGHT*/
    this.initTableData();
    this.transloco();
  }

  ngOnDestroy(): void {
    if (this.selectTranslate$) {
      this.selectTranslate$.unsubscribe();
    }
  }

  onCellOperated(event: CellOperatedEvent): void {
    this.getLayerInfoEmit.emit(event.rowData as LayerInfoResponse);
    this.openDrawerEmit.emit(true);
  }

  onPageChange(event: PageChangeEvent): void {
    const params: fakePlateTableConditionsChange = {
      type: 'page',
      data: event.pageNumber,
    };
    this.getFakePlateTableListEmit.emit(params);
  }
}
