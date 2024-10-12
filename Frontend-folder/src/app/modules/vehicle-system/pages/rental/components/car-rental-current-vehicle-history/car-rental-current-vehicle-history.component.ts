import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription, debounceTime, fromEvent } from 'rxjs';
import { OutCarRentalTransactions } from 'src/app/modules/vehicle-system/interfaces/car-rental/car-rental';
import { DateKey } from 'src/app/modules/vehicle-system/interfaces/key-value-type';
import { RentalConstLibrary } from '../../libs/rental-const-library';

@Component({
  selector: 'vs-car-rental-current-vehicle-history',
  templateUrl: './car-rental-current-vehicle-history.component.html',
  styleUrls: ['./car-rental-current-vehicle-history.component.scss'],
})
export class CarRentalVehicleHistoryComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  @Input() rentalTransactionsData: Array<OutCarRentalTransactions> = [];
  @Input() dataTotal!: number;
  @Input() curPageNo!: number;
  @Input() randowNum!: number;
  @Output() selectedDateEmitEvent: EventEmitter<DateKey> = new EventEmitter<DateKey>();
  @Output() fixedDateEmitEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() nextPageEventEmit: EventEmitter<boolean> = new EventEmitter<boolean>();

  fixedDateList = [{ value: '7', blackColor: false }, { value: '15', blackColor: false }, { value: '30', blackColor: true }];
  activeLangValue = RentalConstLibrary.en;
  isShow = false;
  currentTransactionsData!: OutCarRentalTransactions;
  isSetDefaultDate = 1;

  private scrollDom!: HTMLDivElement;
  private fromEventSubscription!: Subscription;

  constructor(
    private el: ElementRef,
    private translocoService: TranslocoService,
  ) { }

  ngOnChanges(): void {
    this.scrollToTop();
  }

  ngOnInit(): void {
    this.activeLangValue = this.translocoService.getActiveLang();
  }

  ngAfterViewInit(): void {
    this.scrollDom = this.el.nativeElement.querySelector('#historyBox');
    this.fromEventSubscription = fromEvent(this.scrollDom, 'scroll').pipe(
      debounceTime(200),
    ).subscribe(() => {
      this.handleScroll();
    });
  }

  handleScroll(): void {
    const scrollTop = this.scrollDom.scrollTop;
    const windowHeight = this.scrollDom.clientHeight;
    const scrollHeight = this.scrollDom.scrollHeight;
    const total = scrollTop + windowHeight;
    if (total > (scrollHeight - 5)) {
      if (this.rentalTransactionsData.length >= this.dataTotal) return;
      this.nextPageEventEmit.emit();
    }
  }

  scrollToTop(): void {
    if(this.randowNum && this.curPageNo === 1) {
      if(this.scrollDom) this.scrollDom.scrollTo(0, 0);
    }
  }

  clickDateBtn(days: string, index: number): void {
    this.isSetDefaultDate = Date.now();
    this.fixedDateList.forEach(value => value.blackColor = false);
    this.fixedDateList[index].blackColor = true;
    this.fixedDateEmitEvent.emit(days);
  }

  openDetailsModal(item: OutCarRentalTransactions): void {
    this.isShow = true;
    this.currentTransactionsData = item;
  }

  closeModalEvent(): void {
    this.isShow = false;
  }

  selectedDateEmit(event: DateKey): void {
    this.selectedDateEmitEvent.emit(event);
    if (event.startDate && event.endDate) {
      this.fixedDateList.forEach(value => value.blackColor = false);
    }
  }

  // like vue :key = index
  trackByIndex = (index: number): number => {
    return index;
  };

  ngOnDestroy(): void {
    if (this.fromEventSubscription) {
      this.fromEventSubscription.unsubscribe();
    }
  }
}
