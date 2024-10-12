import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import dayjs, { Dayjs } from 'dayjs/esm';
import { TimePeriod } from 'ngx-daterangepicker-material/daterangepicker.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription, finalize } from 'rxjs';
import {
  InCarRentalTransactions,
  OutCarRentalInfoListSearch,
  OutCarRentalTransactions,
  PromiseOutCarRentalTransactions,
} from 'src/app/modules/vehicle-system/interfaces/car-rental/car-rental';
import { DateKey } from 'src/app/modules/vehicle-system/interfaces/key-value-type';
import { CarRentalService } from 'src/app/modules/vehicle-system/services/car-rental/car-rental.service';
import { RentalStorageService } from 'src/app/modules/vehicle-system/services/car-rental/rental-storage.service';
import { RentalConstLibrary } from '../../libs/rental-const-library';

@Component({
  selector: 'vs-car-rental-history',
  templateUrl: './car-rental-history.component.html',
  styleUrls: ['./car-rental-history.component.scss'],
})
export class CarRentalHistoryComponent implements OnInit, OnDestroy {
  backButtonText = '';
  currentCarRentalData!: OutCarRentalInfoListSearch;
  rentalTransactionsData!: Array<OutCarRentalTransactions>;
  pageSize = 10;
  dataTotal = 100;
  randowNum!: number;
  pageNo = 1;

  private searchName = '';
  private fixedToDate!: number;
  private fixedFromDate!: number;
  private customToDate!: number;
  private customFromDate!: number;
  private btnTextselectTranslate$!: Subscription;

  constructor(
    private carRentalService: CarRentalService,
    private translocoService: TranslocoService,
    private rentalStorageService: RentalStorageService,
    private loadingService: NgxUiLoaderService,
  ) { }

  ngOnInit(): void {
    this.getRouterParams();
    this.getBackButtonTextLoco();
    this.dateTrans('30');
  }

  // search
  carRentalSearchEvent(event: string): void {
    this.pageNo = 1;
    this.searchName = event;
    this.randowNum = Math.random();
    this.carRentalTransactions();
  }

  selectedDateEvent(date: DateKey): void {
    if (date.startDate) {
      this.customFromDate = date.startDate as number;
      this.customToDate = date.endDate as number;

      this.carRentalTransactions();
    }
  }

  fixedDateEvent(days: string): void {
    this.customFromDate = 0;
    this.customToDate = 0;
    this.dateTrans(days);
  }

  nextPageEventEmit(): void {
    this.pageNo += 1;
    this.carRentalTransactions();
  }

  private dateTrans(days: string): string | void {
    const dateObj: TimePeriod = {
      startDate: dayjs().subtract(Number(days) - 1, 'days').set('hours', 0).set('minutes', 0).set('second', 0),
      endDate: dayjs().subtract(0, 'days').set('hours', 23).set('minutes', 59).set('second', 59),
    };
    this.fixedFromDate = this.formatTime(dateObj.startDate);
    this.fixedToDate = this.formatTime(dateObj.endDate);

    this.carRentalTransactions();
  }

  // routing parameters
  private getRouterParams(): void {
    this.currentCarRentalData = this.rentalStorageService.commonAccess(RentalConstLibrary.currentCarRentalData) as OutCarRentalInfoListSearch;
  }

  private carRentalTransactions(): void {
    this.loadingService.startLoader('rental-history');
    const inCarRentalTransactions = new InCarRentalTransactions();
    inCarRentalTransactions.renterName = this.searchName;
    inCarRentalTransactions.carNo = this.currentCarRentalData.carNo;
    inCarRentalTransactions.fromDate = this.customFromDate ? this.customFromDate : this.fixedFromDate;
    inCarRentalTransactions.toDate = this.customToDate ? this.customToDate : this.fixedToDate;
    inCarRentalTransactions.pageNo = this.pageNo;
    inCarRentalTransactions.pageSize = this.pageSize;
    this.carRentalService.carRentalTransactions(inCarRentalTransactions).pipe(
      finalize(() => this.loadingService.stopLoader('rental-history')),
    ).subscribe(
      {
        next: res => {
          this.getTransactionsSuc(res);
        },
      },
    );
  }

  getTransactionsSuc(res: PromiseOutCarRentalTransactions): void {
    this.dataTotal = res.total;
    if (this.pageNo === 1) {
      this.rentalTransactionsData = [];
      this.rentalTransactionsData = res.data;
    } else {
      this.rentalTransactionsData = this.rentalTransactionsData.concat(res.data);
    }
  }

  private getBackButtonTextLoco(): void {
    const filed = this.currentCarRentalData.channel === 'vehicle-profile' ? 'vs.rental.backToVehicleProfile' : 'vs.rental.backToCarList';
    this.btnTextselectTranslate$ = this.translocoService.selectTranslate(filed).subscribe(value => {
      this.backButtonText = value;
    });
  }

  private formatTime = (date: Dayjs): number => {
    return date?.valueOf();
  };

  ngOnDestroy(): void {
    if (this.btnTextselectTranslate$) {
      this.btnTextselectTranslate$.unsubscribe();
    }
  }
}
