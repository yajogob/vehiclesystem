import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription, finalize } from 'rxjs';
import {
  ColDef,
  ICellRendererParams,
  PageChangeEvent,
  RowClickedEvent,
} from "../../components/pagination-grid";
import { CompanyInfo, InRentalCompanyListSearch } from '../../interfaces/car-rental/car-rental';
import { TRAFFICMenuList } from '../../interfaces/rbac';
import { AllResourceList, PathLib } from '../../libs/path-library';
import { CarRentalService } from '../../services/car-rental/car-rental.service';
import { RouterService } from '../../services/router.service';
import { LoggerService } from '../../utils/logger.service';

@Component({
  selector: 'vs-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.scss'],
})
export class RentalComponent implements OnInit, OnDestroy {
  carRentalList!: Array<CompanyInfo>;
  pagedRentalCompanyList: Array<CompanyInfo> = [];
  tableColumnDefs: ColDef[] = [];
  defaultColDef: ColDef = {flex: 1};
  dataTotal = 0;
  pageNo = 1;
  pageSize = 20;
  allResourceList = AllResourceList;

  private searchName!: string;
  private selectTranslate$!: Subscription;

  constructor(
    private carRentalService: CarRentalService,
    private routerService: RouterService,
    private translocoService: TranslocoService,
    private logger: LoggerService,
    private loadingService: NgxUiLoaderService,
  ) { }

  ngOnInit(): void {
    this.loadingService.destroyLoaderData('rental');
    this.initTableData();
    this.transloco();
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
    if (!this.accessHandle(this.allResourceList.CarRentalList)) return;
    sessionStorage.setItem(`company_id_${event.data.id}`, JSON.stringify(event.data));
    const navigationExtras: NavigationExtras = {queryParams: {id: event.data.id}};
    this.routerService.navigate([PathLib.CAR_RENTAL_LIST], navigationExtras);
  }

  onPageChange = (event: PageChangeEvent): void => {
    this.pageNo = event.pageNumber;
    this.searchCompanyList();
  };

  onPageSizeChange(event: number): void {
    this.pageSize = event;
  }

  carRentalSearchEvent(searchName: string): void {
    this.pageNo = 1;
    this.searchName = searchName;
    // this.loadingService.bindLoaderData('rental');
    this.searchCompanyList();
  }

  private searchCompanyList(): void {
    this.loadingService.startLoader('rental');
    const inRentalCompanyListSearch = new InRentalCompanyListSearch();
    inRentalCompanyListSearch.companyName = this.searchName;
    inRentalCompanyListSearch.pageNo = this.pageNo;
    inRentalCompanyListSearch.pageSize = this.pageSize;
    this.carRentalService.rentalCompaniesListSearch(inRentalCompanyListSearch).pipe(
      finalize(() => this.loadingService.stopLoader('rental')),
    ).subscribe(
      {
        next: res => {
          this.dataTotal = res.total;
          this.carRentalList = res.data;
        },
      },
    );
  }

  private initTableData(): void {
    this.tableColumnDefs = [
      { field: 'companyEnglishName', headerName: 'companyNameEnglish' },
      { field: 'companyArabicName', headerName: 'companyNameArabic' },
      { field: 'tradeLicenseNum', headerName: 'tradeLicenseNumber' },
      {
        field: 'telephone1', headerName: 'telephoneNumber',
        cellRenderer (param: ICellRendererParams): string {
          return param.data.telephone1 + '<br/>' + param.data.telephone2;
        },
      },
      { field: 'address', headerName: 'address', width: 300, wrapText: true, autoHeight: true },
      { field: 'emiratesCode', headerName: 'emiratesCode' },
    ];
  }

  private transloco(): void {
    this.tableColumnDefs.forEach(e => {
      this.selectTranslate$ = this.translocoService.selectTranslate(`vs.rental.${e.headerName}`).subscribe(value => {
        e.headerName = value;
      });
    });
  }

  ngOnDestroy(): void {
    if (this.selectTranslate$) {
      this.selectTranslate$.unsubscribe();
    }
  }
}
