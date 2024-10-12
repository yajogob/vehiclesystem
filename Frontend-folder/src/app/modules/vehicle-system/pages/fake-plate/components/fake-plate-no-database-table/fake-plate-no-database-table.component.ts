import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ThemeService } from '@core/services/theme.service';
import { TranslocoService } from '@ngneat/transloco';
import dayjs from 'dayjs/esm';
import { Subscription } from 'rxjs';
import { TrafficSearchItem } from 'src/app/modules/vehicle-system/interfaces/traffic-search/traffic-search';
import { ColDef, ICellRendererParams, PageChangeEvent } from '../../../../components/pagination-grid';
import { fakePlateTableConditionsChange } from '../../../../interfaces/fake-plate/fake-plate';

@Component({
  selector: 'vs-fake-plate-no-database-table',
  templateUrl: './fake-plate-no-database-table.component.html',
  styleUrls: [ './fake-plate-no-database-table.component.scss' ],
})
export class FakePlateNoDatabaseTableComponent implements OnInit, OnDestroy {
  @Input() totalElements!: number;
  @Input() currentPage = 1;
  @Input() searchTableInfo!: Array<TrafficSearchItem>;

  @Output() pageEventEmit = new EventEmitter<fakePlateTableConditionsChange>();

  tableColumnDefs: ColDef[] = [];

  private selectTranslate$!: Subscription;

  constructor(private translocoService: TranslocoService, private themeService: ThemeService) {
  }

  ngOnInit(): void {
    this.initTableData();
  }

  ngOnDestroy(): void {
    if (this.selectTranslate$) {
      this.selectTranslate$.unsubscribe();
    }
  }

  onPageChange(event: PageChangeEvent): void {
    const params: fakePlateTableConditionsChange = {
      isNoDataBase: '1',
      type: 'page',
      data: event.pageNumber,
    };
    this.pageEventEmit.emit(params);
  }

  private initTableData(): void {
    this.tableColumnDefs = [
      {field: 'cameraName', headerName: 'cameraName', flex: 1},
      {field: 'siteName', headerName: 'siteName', flex: 1},
      {
        field: 'captureTime', headerName: 'captureTime', width: 240,
        cellRenderer: (params: ICellRendererParams): string => {
          return `<span>${ dayjs(Number(params.value)).format('MMM D, YYYY h:mm A') }</span>`;
        },
      },
      { field: 'region', headerName: 'region', flex: 1},
      {
        field: 'plateImage', headerName: 'plateImage', flex: 1,
        cellRenderer: (params: ICellRendererParams): string => {
          return `<img style="width: 100px; height: 32px;" src="${ params.value }" alt=""/>`;
        },
      },
      { field: 'category', headerName: 'category', flex: 1},
      { field: 'plateNumber', headerName: 'plateNo', flex: 1},
    ];

    this.transloco();
  }

  private transloco(): void {
    this.tableColumnDefs.forEach(e => {
      this.selectTranslate$ = this.translocoService.selectTranslate(`vs.fakePlateNumber.${ e.headerName }`)
        .subscribe(value => {
          e.headerName = value;
        });
    });
  }

}
