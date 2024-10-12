import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { TranslocoService, translate } from '@ngneat/transloco';
import dayjs, { Dayjs } from 'dayjs/esm';
import 'dayjs/esm/locale/ar';
import localeData from 'dayjs/esm/plugin/localeData';
import updateLocale from 'dayjs/esm/plugin/updateLocale';
import utc from 'dayjs/esm/plugin/utc';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';
import { DateRanges, TimePeriod } from 'ngx-daterangepicker-material/daterangepicker.component';
import { Subscription } from 'rxjs';
import { DateKey } from '../../interfaces/key-value-type';
import { I18nService } from "../../utils/i18n.service";

@Component({
  selector: 'vs-vehicle-date-input',
  templateUrl: './vehicle-date-input.component.html',
  styleUrls: ['./vehicle-date-input.component.scss'],
})
export class VehicleDateInputComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @ViewChild(DaterangepickerDirective, {static: false}) pickerDirective!: DaterangepickerDirective;
  @Input() showCustomClear = false;
  @Input() position = '';
  @Input() translate = '';
  @Input() inputDatePlaceholder = 'vs.public.dateAndTime';
  @Input() showClearButton = false;
  @Input() toolboxTrigger = false;
  @Input() autoApply = false;
  @Input() inputVisible = 'input-visible';
  @Input() dateInputPosition = '';
  @Input() selected: TimePeriod | null = {
    startDate: dayjs().startOf("day"),
    endDate: dayjs().endOf('day'),
  };

  @Input() dateLimit = 1094;
  @Input() ranges!: DateRanges;
  @Input() show24Time = false;
  @Input() timePicker = true;
  @Input() lockStartDate = false;
  @Input() dateSelectRestrict!: string;
  @Output() selectedDateEmit: EventEmitter<DateKey> = new EventEmitter<DateKey>();
  @Output() autoApplyChange: EventEmitter<DateKey> = new EventEmitter<DateKey>();
  @Input() inputUuid = `date-input-${Math.floor(Math.random() * 100000000)}`;

  protected activeLangValue!: string;
  protected selectedDateLabel = '';
  protected showModalBg = false;
  protected autoApplyClass = '';
  protected placeholder!: string;
  protected locale!: NonNullable<unknown>;
  protected localeI18n = [
    {key: 'vs.dateinput.button.update', value: ''},
    {key: 'vs.dateinput.button.cancel', value: ''},
    {key: 'vs.dateinput.customRangeLabel', value: ''},
    {key: 'vs.dateinput.today', value: ''},
    {key: 'vs.dateinput.last7days', value: ''},
    {key: 'vs.dateinput.last30days', value: ''},
    {key: 'vs.dateinput.this.year', value: ''},
  ];

  protected selectTranslate$!: Subscription;
  protected dateSelected?:TimePeriod;

  constructor(
    private i18nService: I18nService,
    private translocoService: TranslocoService,
  ) {
    // Listening and switching language
    this.translocoService.langChanges$.subscribe(value => {
      this.updateLocale(value);
    });
  }

  ngOnChanges(): void {
    this.formatSelectedDate(this.selected?.startDate, this.selected?.endDate);
    this.dateSelected = Object.assign({}, this.selected);
  }

  ngOnInit(): void {
    document.addEventListener('keyup', this.closeDateSelectorByEsc);
    if (this.toolboxTrigger) {
      this.inputVisible = '';
    }
    if (this.autoApply) {
      this.autoApplyClass = 'hidden-date-update-btns';
    } else {
      this.autoApplyClass = '';
    }
    this.transloco();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.placeholder = translate(this.inputDatePlaceholder);
      this.formatSelectedDate(this.dateSelected?.startDate, this.dateSelected?.endDate);
    }, 300);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  closeDateSelectorByEsc = (event: any): void => {
    if (event.key === 'Escape') {
      this.pickerDirective.hide(event);
      this.showModalBg = false;
    }
  };

  protected transloco(): void {
    this.localeI18n.forEach(item => {
      this.selectTranslate$ = this.translocoService.selectTranslate(item.key).subscribe(value => {
        item.value = '';
        item.value = value;
      });
    });

    this.dateLocale();
    this.translateRanges();
  }

  protected dateLocale(): void {
    this.locale = {
      direction: this.i18nService.getDirection(),
      applyLabel: this.localeI18n[0].value,
      cancelLabel: this.localeI18n[1].value,
      monthNames: dayjs.months(),
      daysOfWeek: dayjs.weekdaysMin(),
      firstDay: dayjs.localeData().firstDayOfWeek(),
      customRangeLabel: this.localeI18n[2].value,
      displayFormat: this.timePicker ? (this.show24Time ? "MMM D, YYYY H:mm" : "MMM D, YYYY h:mm A") : "MMM D, YYYY",
    };
  }

  protected translateRanges(): void {
    if(!this.ranges) {
      this.ranges = {
        [this.localeI18n[3].value]: [dayjs().startOf("day"), dayjs().endOf('day')],
        [this.localeI18n[4].value]: [dayjs().subtract(6, 'days').startOf("day"), dayjs().endOf('day')],
        [this.localeI18n[5].value]: [dayjs().subtract(30, 'days').startOf("day"), dayjs().endOf('day')],
        [this.localeI18n[6].value]: [dayjs().subtract(365, 'days').startOf("day"), dayjs().endOf('day')],
      };
    }
  }

  protected clearDate(): void {
    this.dateSelected = undefined;
    const date: DateKey = {
      startDate: null,
      endDate: null,
      curSelected: null,
    };
    if (!this.autoApply) {
      this.selectedDateEmit.emit(date);
    }
  }

  protected clickModal(e: MouseEvent): void {
    this.pickerDirective.hide(e);
    this.showModalBg = false;
  }

  protected isInvalidDate = (m: dayjs.Dayjs): boolean => {
    switch (this.dateSelectRestrict) {
      case 'endAfterToday':
        return this.isInvalidDateWhiteList(m);
      case 'noRestrict':
        return false;
      case 'dontSelectPastDate':
        return this.disablePastDate(m);
      default:
        return this.disableFutureDate(m);
    }
  };

  private isInvalidDateWhiteList = (date: Dayjs): boolean => {
    return this.lockStartDate && dayjs(this.dateSelected?.startDate).isAfter(date, 'day');
  };

  private disableFutureDate = (date: Dayjs): boolean => {
    return date.isAfter(dayjs(), 'day');
  };

  private disablePastDate = (date: Dayjs): boolean => {
    return date.isBefore(dayjs(), 'day');
  };

  protected datesUpdated(range: TimePeriod): void {
    this.showModalBg = false;
    const startDate = this.formatTime(range.startDate);
    const endDate = this.formatTime(range.endDate);
    this.dateEmit(startDate as number, endDate as number);
    this.formatSelectedDate(range.startDate, range.endDate);
  }

  protected dateInputClick(): void {
    this.showModalBg = true;
    this.createDom(`.${this.inputUuid} .btn-default`);
  }

  ngModelChange(range: TimePeriod):void {
    if (this.autoApply) {
      this.formatSelectedDate(range.startDate, range.endDate);
      const startDate = this.formatTime(range.startDate);
      const endDate = this.formatTime(range.endDate);
      const date: DateKey = {
        startDate: startDate as number,
        endDate: endDate as number,
        curSelected: this.dateSelected as TimePeriod | null,
        selectedDateLabel: this.selectedDateLabel,
      };
      this.autoApplyChange.emit(date);
    }
  }

  private createDom(className: string): void {
    const pdom = document.querySelector(className);
    (pdom as HTMLElement).style.position = 'relative';
    const sDiv = document.createElement('div');
    sDiv.style.position = 'absolute';
    sDiv.style.top = '0';
    sDiv.style.left = '0';
    sDiv.style.bottom = '0';
    sDiv.style.right = '0';
    sDiv.onclick = (): void => {
      this.showModalBg = false;
    };
    pdom?.append(sDiv);
  }

  private formatSelectedDate(startDate: Dayjs | undefined, endDate: Dayjs | undefined): void {
    if (startDate && endDate) {
      const displayFormat = this.timePicker ? (this.show24Time ? "MMM D, YYYY H:mm" : "MMM D, YYYY h:mm A") : "MMM D, YYYY";
      this.selectedDateLabel = startDate.format(displayFormat) + ' - ' + endDate.format(displayFormat);
      for (const key in this.ranges) {
        const arr = this.ranges[key];
        const startTime = arr[0].format(displayFormat);
        const endTime = arr[1].format(displayFormat);
        if (this.selectedDateLabel == startTime + ' - ' + endTime) {
          this.selectedDateLabel = key;
        }
      }
    } else {
      this.selectedDateLabel = '';
    }
  }

  private dateEmit(startDate: number, endDate: number): void {
    const date: DateKey = {
      startDate,
      endDate,
      curSelected: this.dateSelected as TimePeriod | null,
    };
    if (!this.autoApply) {
      this.selectedDateEmit.emit(date);
    }
  }

  private formatTime = (date: Dayjs): number | null => {
    if (date) {
      const localTime = `${date.year()}-${date.month() + 1}-${date.date()} ${date.hour()}:${date.minute()}:${date.second()}`;
      return new Date(localTime).getTime();
    } else {
      return null;
    }
  };

  private updateLocale = (value: string): void => {
    dayjs.extend(localeData);
    dayjs.extend(updateLocale);
    dayjs.extend(utc);
    dayjs.locale(value);
  };

  openDaterangerPicker(e: MouseEvent): void {
    this.pickerDirective.open(e);
    if (!this.autoApply) {
      this.showModalBg = true;
      this.createDom(`.${this.inputUuid} .btn-default`);
    }
  }

  ngOnDestroy(): void {
    this.selectTranslate$ && this.selectTranslate$.unsubscribe();
  }
}
