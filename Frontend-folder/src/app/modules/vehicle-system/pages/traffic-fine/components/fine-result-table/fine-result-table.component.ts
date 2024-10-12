import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { ColDef, ICellRendererParams, RowClickedEvent } from 'ag-grid-community';
import { PageChangeEvent } from 'src/app/modules/vehicle-system/components/pagination-grid';
import { SortChangeEvent } from 'src/app/modules/vehicle-system/components/pagination-grid/pagination-grid.component';
import { KeyValueType } from 'src/app/modules/vehicle-system/interfaces/key-value-type';
import { OutTrafficFineSearch } from 'src/app/modules/vehicle-system/interfaces/traffic-fine/traffic-fine';

@Component({
  selector: 'vs-fine-result-table',
  templateUrl: './fine-result-table.component.html',
  styleUrls: ['./fine-result-table.component.scss'],
})
export class FineResultTableComponent implements OnInit {
  @Input() language = 'en';
  @Input() totalItems = 0;
  @Input() currentPage = 1;
  @Input() rowData: OutTrafficFineSearch[] = [];
  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() pageNoChange: EventEmitter<number> = new EventEmitter<number>();

  tableColumnDefs: ColDef[] = [];
  languageMap: KeyValueType = {
    'en': 'En',
    'ar': 'Ar',
  };

  constructor(
    private translocoService: TranslocoService,
  ) {}


  /* Lifecycle function  -----start */
  ngOnInit(): void {
    this.initTableColumnDefs();
  }
  /* Lifecycle function  -----end */


  /* custom function   -----start */
  private initTableColumnDefs(): void {
    this.tableColumnDefs = [
      {
        headerName: 'TicketNumber', flex: 0.8, cellRenderer: (params: ICellRendererParams): string => {
          return `<span class="line-clamp-2 break-all" title="${params.data.ticketNumber}">
                    ${params.data.ticketNumber}
                  </span>`;
        },
      },
      {
        headerName: 'TicketDescription', flex: 1, cellRenderer: (params: ICellRendererParams): string => {
          const renderKey = 'ticketDescription' + this.languageMap[this.language];
          return `<span class="line-clamp-2" title="${params.data[renderKey]}">
                    ${params.data[renderKey]}
                  </span>`;
        },
      },
      {
        headerName: 'TicketDate', flex: 0.9, cellRenderer: (params: ICellRendererParams): string => {
          return `<span class="line-clamp-2" title="${params.data.ticketTime}">
                    ${params.data.ticketTime}
                  </span>`;
        },
      },
      {
        headerName: 'TicketLocation', flex: 1, cellRenderer: (params: ICellRendererParams): string => {
          const renderKey = 'location' + this.languageMap[this.language];
          return `<span class="line-clamp-2" title="${params.data[renderKey]}">
                    ${params.data[renderKey]}
                  </span>`;
        },
      },
      {
        headerName: 'PlateNumber', flex: 0.8, cellRenderer: (params: ICellRendererParams): string => {
          return `<span class="line-clamp-2" title="${params.data.licensePlateDetails}">
                    ${params.data.licensePlateDetails}
                  </span>`;
        },
      },
      {
        headerName: 'PlateColor', flex: 0.8, cellRenderer: (params: ICellRendererParams): string => {
          return `<span class="line-clamp-2" title="${params.data.plateColor}">
                    ${params.data.plateColor}
                  </span>`;
        },
      },
      {
        headerName: 'DriverLicenseNumber', flex: 1, cellRenderer: (params: ICellRendererParams): string => {
          return `<span class="line-clamp-2 break-all" title="${params.data.driverLicense}">
                    ${params.data.driverLicense}
                  </span>`;
        },
      },
      {
        headerName: 'DriverTrafficFileNumber', flex: 1.2, cellRenderer: (params: ICellRendererParams): string => {
          return `<span class="line-clamp-2 break-all" title="${params.data.driverTrafficFileNumber}">
                    ${params.data.driverTrafficFileNumber}
                  </span>`;
        },
      },
      {
        headerName: 'DriverName', flex: 1, cellRenderer: (params: ICellRendererParams): string => {
          return `<span class="line-clamp-2" title="${params.data.driverName}">
                    ${params.data.driverName}
                  </span>`;
        },
      },
      {
        headerName: 'VehicleOwnerName', flex: 1, cellRenderer: (params: ICellRendererParams): string => {
          return `<span class="line-clamp-2" title="${params.data.vehicleOwnerName}">
                    ${params.data.vehicleOwnerName}
                  </span>`;
        },
      },
      {
        headerName: 'VehicleOwnerTrafficFileNumber', flex: 1.2, cellRenderer: (params: ICellRendererParams): string => {
          return `<span class="line-clamp-2 break-all" title="${params.data.vehicleOwnerTrafficFileNum}">
                    ${params.data.vehicleOwnerTrafficFileNum}
                  </span>`;
        },
      },
    ];
    this.i18nTranslation();
  }

  private i18nTranslation(): void {
    this.tableColumnDefs.forEach(e => {
      this.translocoService.selectTranslate(`vs.trafficFine.${ e.headerName }`).subscribe(value => {
        e.headerName = value;
      });
    });
  }

  onSortChanged(event: SortChangeEvent): void {
    this;event;
  }

  onRowClicked(event: RowClickedEvent): void {
    this;event;
  }

  onPageChange(event: PageChangeEvent): void {
    this.pageNoChange.emit(event.pageNumber);
  }

  onPageSizeChange(event: number): void {
    this.pageSizeChange.emit(event);
  }
  /* custom function   -----end */
}
