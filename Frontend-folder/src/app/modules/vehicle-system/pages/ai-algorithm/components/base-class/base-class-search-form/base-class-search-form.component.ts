import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import dayjs, { Dayjs } from 'dayjs/esm';
import { TimePeriod } from 'ngx-daterangepicker-material/daterangepicker.component';
import { Subscription } from 'rxjs';
import { DateKey } from 'src/app/modules/vehicle-system/interfaces/key-value-type';
import { AllResourceList } from 'src/app/modules/vehicle-system/libs/path-library';
import { AiAlgorithmService } from 'src/app/modules/vehicle-system/services/ai-algorithm/ai-algorithm.service';
import { LoggerService } from 'src/app/modules/vehicle-system/utils/logger.service';
import { AiConstLibrary } from '../../../libs/ai-const-library';

@Component({
  selector: 'vs-base-class-search-form',
  templateUrl: './base-class-search-form.component.html',
})
export class BaseClassSearchFormComponent implements OnInit, OnDestroy {
  @Input() immediate: '0' | '1' = '1'; // 1：Execute Search Now; 0：Search on user click
  @Output() createNewTaskEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output() selectedDateFnEmit: EventEmitter<DateKey> = new EventEmitter<DateKey>();

  protected allResourceList = AllResourceList;
  protected activeLangValue = AiConstLibrary.en;
  protected selected: TimePeriod | null = null;
  protected behavior$!: Subscription;
  protected codeItemSub$!: Subscription;

  constructor(
    protected translocoService: TranslocoService,
    protected aiAlgorithmService: AiAlgorithmService,
    protected logger: LoggerService,
  ) {}

  ngOnInit(): void {
    this.initSearchDate();
    if (this.immediate === '1') this.searchClick();
    this.activeLangValue = this.translocoService.getActiveLang();
    this.initSubject();
  }

  // child achieve
  protected searchClick(): void {
    this.logger.info('base-searchClick');
  }

  private formatTime = (date: Dayjs | undefined): number => {
    if (date) {
      const localTime = `${date.year()}-${date.month() + 1}-${date.date()} ${date.hour()}:${date.minute()}:${date.second()}`;
      return new Date(localTime).getTime();
    } else {
      return 0;
    }
  };

  private initSearchDate(): void {
    this.selected = {
      startDate: dayjs().subtract(6, 'days').startOf("day"),
      endDate: dayjs().subtract(0, 'days').endOf('day'),
    };
    const dateParams = {
      startDate: this.formatTime(this.selected.startDate),
      endDate: this.formatTime(this.selected.endDate),
      curSelected: this.selected,
    };
    this.selectedDateFn(dateParams);
  }

  protected selectedDateFn(event: DateKey): void {
    if (!event.startDate || !event.endDate) {
      event.startDate = this.formatTime(event?.curSelected?.startDate);
      event.endDate = this.formatTime(event?.curSelected?.endDate);
    }
    this.selectedDateFnEmit.emit(event);
    this.aiAlgorithmService.businessToToolBoxDateChange$.next(event);
  }

  protected initSubject(): void {
    this.behavior$ = this.aiAlgorithmService.toolBoxToBusinessDateChange$.subscribe(dateParams => {
      if (dateParams.startDate) {
        this.selected = {
          startDate: dayjs(dateParams.startDate),
          endDate: dayjs(dateParams.endDate),
        };
        this.selectedDateFnEmit.emit(dateParams);
        this.searchClick();
      }
    });
  }

  createNewTask(): void {
    this.createNewTaskEmit.emit();
  }

  ngOnDestroy(): void {
    this.behavior$ && this.behavior$.unsubscribe();
    this.codeItemSub$ && this.codeItemSub$.unsubscribe();
  }
}
