import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { ITooltipParams } from 'ag-grid-community';
import dayjs from 'dayjs/esm';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription, finalize } from 'rxjs';
import {
  InCarRentalInfoListSearch,
  InRentalCompanyDetailsSearch,
  OutCarRentalInfoListSearch,
  OutCompanyDetailsData,
} from 'src/app/modules/vehicle-system/interfaces/car-rental/car-rental';
import { KeyValueType } from 'src/app/modules/vehicle-system/interfaces/key-value-type';
import { TRAFFICMenuList } from 'src/app/modules/vehicle-system/interfaces/rbac';
import { AllResourceList, PathLib } from 'src/app/modules/vehicle-system/libs/path-library';
import { CarRentalService } from 'src/app/modules/vehicle-system/services/car-rental/car-rental.service';
import { RentalStorageService } from 'src/app/modules/vehicle-system/services/car-rental/rental-storage.service';
import { RouterService } from 'src/app/modules/vehicle-system/services/router.service';
import { I18nService } from 'src/app/modules/vehicle-system/utils/i18n.service';
import { ColDef, ICellRendererParams, PageChangeEvent, RowClickedEvent } from "../../../../components/pagination-grid";
import { RentalConstLibrary } from '../../libs/rental-const-library';

@Component({
  selector: 'vs-car-rental-list',
  templateUrl: './car-rental-list.component.html',
  styleUrls: ['./car-rental-list.component.scss'],
})
export class CarRentalListComponent implements OnInit, OnDestroy {
  backButtonText = ''; // button text
  companyDetailsData!: OutCompanyDetailsData; // Car rental company information
  carRentalListData!: Array<OutCarRentalInfoListSearch>; //
  tableColumnDefs: ColDef[] = [];
  defaultColDef: ColDef = {wrapText: true, flex: 1};
  curCompanyId!: string;
  searchName!: string;
  dataTotal = 0;
  pageNo = 1;
  pageSize = 12;
  language='';
  languageCodeMap: KeyValueType = {
    'en': 'En',
    'ar': 'Ar',
  };

  private btnTextselectTranslate$!: Subscription;
  private tableSelectTranslate$!: Subscription;
  allResourceList = AllResourceList;

  constructor(
    private route: ActivatedRoute,
    private carRentalService: CarRentalService,
    private routerService: RouterService,
    private i18nService: I18nService,
    private translocoService: TranslocoService,
    private rentalStorageService: RentalStorageService,
    private loadingService: NgxUiLoaderService,
  ) { }

  ngOnInit(): void {
    this.language = this.i18nService.getLanguage();
    this.i18nService.getLanguageObservable().subscribe(lang => {
      this.language = lang;
    });
    this.loadingService.destroyLoaderData('rental-list');
    this.getRouterParams();
    this.initTableData();
    this.transloco();
    this.getBackButtonTextLoco();
  }

  accessHandle = (accessName: string): boolean => {
    const meunListRes = JSON.parse(localStorage.getItem('menuList') || '[]');
    const accessParams = accessName || '';
    const next = meunListRes.some((item: TRAFFICMenuList) => {
      return item.uriSet.includes(accessParams);
    });
    return next;
  };

  // search
  carRentalSearchEvent(event: string): void {
    this.pageNo = 1;
    this.searchName = event;
    this.carRentalRecordsListSearch();
  }

  onRowClicked(event: RowClickedEvent): void {
    if (this.accessHandle(this.allResourceList.CarRentalHistory)) {
      this.rentalStorageService.commonAccess(RentalConstLibrary.currentCarRentalData, event.data);
      this.routerService.navigate([PathLib.CAR_RENTAL_HISTORY]);
    }
  }

  onPageChange = (event: PageChangeEvent): void => {
    this.pageNo = event.pageNumber;
    this.carRentalRecordsListSearch();
  };

  onPageSizeChange(event: number): void {
    this.pageSize = event;
  }

  private transloco(): void {
    this.tableColumnDefs.forEach(e => {
      this.tableSelectTranslate$ = this.translocoService.selectTranslate(`vs.rental.${e.headerName}`).subscribe(value => {
        e.headerName = value;
      });
    });
  }

  // routing parameters
  private getRouterParams(): void {
    this.route.queryParams.subscribe(params => {
      this.curCompanyId = params['id'];
      const dataStr = sessionStorage.getItem(`company_id_${this.curCompanyId}`) || '';
      this.companyDetailsData = JSON.parse(dataStr);

      // this.searchCompanyDetails();
    });
  }

  // Car rental company detailed information query
  private searchCompanyDetails(): void {
    const inRentalCompanyDetailsSearch = new InRentalCompanyDetailsSearch();
    inRentalCompanyDetailsSearch.companyId = this.curCompanyId;
    this.carRentalService.rentalCompanyDetailSearch(inRentalCompanyDetailsSearch).subscribe(
      {
        next: res => {
          this.companyDetailsData = res;
        },
      },
    );
  }

  // Car rental record list query
  private carRentalRecordsListSearch(): void {
    this.loadingService.startLoader('rental-list');
    const inCarRentalInfoListSearch = new InCarRentalInfoListSearch();
    inCarRentalInfoListSearch.plateNumber = this.searchName;
    inCarRentalInfoListSearch.companyId = this.curCompanyId;
    inCarRentalInfoListSearch.pageNo = this.pageNo;
    inCarRentalInfoListSearch.pageSize = this.pageSize;
    this.carRentalService.carRentalVehiclesSearch(inCarRentalInfoListSearch).pipe(
      finalize(() => this.loadingService.stopLoader('rental-list')),
    ).subscribe(
      {
        next: res => {
          this.dataTotal = res.total;
          this.carRentalListData = res.data;
        },
      },
    );
  }

  private getBackButtonTextLoco(): void {
    this.btnTextselectTranslate$ = this.translocoService.selectTranslate('vs.rental.backToCarRentalCompanyList').subscribe(value => {
      this.backButtonText = value;
    });
  }

  private initTableData(): void {
    this.tableColumnDefs = [
      {
        field: 'plateNumber', headerName: 'carPlateNumber',
        cellRenderer: (params: ICellRendererParams): string => {
          return `<span class='line-clamp-2'>
          ${params.data.fullLicenseDetails || ''}</span>`;
        },
        tooltipValueGetter: (params: ITooltipParams): string => {
          return `${params.data.fullLicenseDetails || ''}`;
        },
      },
      { field: `carColor${this.languageCodeMap[this.language]}`, headerName: 'carColor'},
      {
        field: 'chassisNumber', headerName: 'chassisNumber',
        cellRenderer: (params: ICellRendererParams): string => {
          return `<span class='line-clamp-2'>${params.data.chassisNumber || ''}</span>`;
        },
        wrapText: true,
        tooltipField: 'chassisNumber',
      },
      { field: 'modelYear', headerName: 'modelYear'},
      { field: `carMake${this.languageCodeMap[this.language]}`, headerName: 'carMake'},
      { field: `carModel${this.languageCodeMap[this.language]}`, headerName: 'caeModel'},
      { field: 'registrationNum', headerName: 'registrationNo'},
      {
        field: 'registrationDate', headerName: 'registrationDate',
        cellRenderer (param: ICellRendererParams): string {
          return dayjs(Number(param.data.registrationDate)).format('MMM D, YYYY h:mm A');
        },
      },
      {
        field: 'registrationExpiry', headerName: 'registrationExpiry',
        cellRenderer (param: ICellRendererParams): string {
          return dayjs(Number(param.data.registrationExpiry)).format('MMM D, YYYY h:mm A');
        },
      },
      { field: 'registrationPlace', headerName: 'registrationPlace'},
      {
        field: 'status', headerName: 'carStatus',
        cellStyle: (params): {color: string} | null => {
          if (params.value === 'Rented') return {color: 'red'};
          if (params.value === 'Available') return {color: 'green'};
          return null;
        },
      },
    ];
  }

  ngOnDestroy(): void {
    if (this.btnTextselectTranslate$) this.btnTextselectTranslate$.unsubscribe();
    if (this.tableSelectTranslate$) this.btnTextselectTranslate$.unsubscribe();
  }
}
