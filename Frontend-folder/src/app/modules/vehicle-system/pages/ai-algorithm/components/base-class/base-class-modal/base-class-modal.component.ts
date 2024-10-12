import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslocoService, translate } from '@ngneat/transloco';
import dayjs from 'dayjs/esm';
import { DateRanges, TimePeriod } from 'ngx-daterangepicker-material/daterangepicker.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';
import { FcMapType, FcType, WatchAndWhiteCreateTask } from 'src/app/modules/vehicle-system/interfaces/ai-algorithm/ai-algorithm';
import { CodeItemsApi, CodesArrayItem, DateKey, KeyValueType } from 'src/app/modules/vehicle-system/interfaces/key-value-type';
import { MessageService } from 'src/app/modules/vehicle-system/services/common/message.service';
import { CodeItemService } from 'src/app/modules/vehicle-system/services/global-subscription.service';
import { LoggerService } from 'src/app/modules/vehicle-system/utils/logger.service';
import { AiConstLibrary } from '../../../libs/ai-const-library';

@Component({
  selector: 'vs-base-class-modal',
  templateUrl: './base-class-modal.component.html',
})
export class BaseClassModalComponent implements OnInit, OnDestroy{
  @Output() saveSucEmit: EventEmitter<boolean> = new EventEmitter<boolean>();

  protected dtVisible = false;
  protected codeDictList!: Array<CodeItemsApi>; // Code dictionary list
  protected codeItemSub$!: Subscription;
  protected startDate!: number;
  protected endDate!: number;
  protected activeLangValue = AiConstLibrary.en;
  protected codeItemFuncMap!: FcMapType;
  protected editModalDate!: WatchAndWhiteCreateTask;
  protected selected: TimePeriod | null = null;
  protected maxlength = 60; // en: 60, ar: 30
  protected timeTips = translate('vs.aiAlgorithm.timeDetermine');
  protected ranges!: DateRanges;

  constructor(
    protected translocoService: TranslocoService,
    protected codeItemService: CodeItemService,
    protected loadingService: NgxUiLoaderService,
    protected logger: LoggerService,
    protected messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.activeLangValue = this.translocoService.getActiveLang();
    this.initRanges();
    this.setCodeItem();
    this.initForm();
    this.initDate();
    this.maxlength = this.activeLangValue === 'en' ? 60 : 30;
  }

  protected initRanges(): void {
    const hours = new Date().getHours();
    const minutes = new Date().getMinutes();
    const second = new Date().getSeconds();
    this.ranges = {
      [translate('vs.dateinput.today')]:
      [dayjs().subtract(0, 'days').set('hours', hours).set('minutes', minutes).set('second', second), dayjs().endOf("day")],
    };
  }

  // child achieve
  protected setCodeItem(): void {
    this.logger.info('base-setCodeItem');
  }

  // child achieve
  protected initForm(): void {
    this.logger.info('base-initForm');
  }

  // child achieve
  protected initDate(): void {
    this.logger.info('base-initDate');
  }

  protected editInitDate(): void {
    this.initRanges();
    this.startDate = dayjs(Number(this.editModalDate.startDateTime)).valueOf();
    this.endDate = dayjs(Number(this.editModalDate.endDateTime)).valueOf();
    this.selected = {
      startDate: dayjs(Number(this.editModalDate.startDateTime)),
      endDate: dayjs(Number(this.editModalDate.endDateTime)),
    };
  }

  protected createInitDate(): void {
    this.initRanges();
    const hours = new Date().getHours();
    const minutes = new Date().getMinutes();
    const second = new Date().getSeconds();
    this.selected = {
      startDate: dayjs().subtract(0, 'days').set('hours', hours).set('minutes', minutes).set('second', second),
      endDate: dayjs().endOf('day'),
    };

    this.startDate = dayjs().subtract(0, 'days').set('hours', hours).set('minutes', minutes).set('second', second).valueOf();
    this.endDate = dayjs().subtract(0, 'days').set('hours', 23).set('minutes', 59).set('second', 59).valueOf();
  }

  protected timeDetermine(): boolean {
    const now = new Date().getTime();
    if(this.startDate < now && this.endDate < now) {
      this.messageService.error(this.timeTips);
      return false;
    }
    return true;
  }

  protected showSiteModal(): void {
    this.dtVisible = true;
  }

  protected closeSiteModal(): void {
    this.dtVisible = false;
  }

  protected selectedDateFn(date: DateKey): void {
    if (date.startDate && date.endDate) {
      this.startDate = date.startDate;
      this.endDate = date.endDate;
    }
  }

  protected initSelectItemData(): void {
    this.codeItemSub$ = this.codeItemService.subject$.subscribe(
      {
        next: res => {
          this.codeDictList = res.data;
          this.getCodeItemSuc(res.data);
        },
      },
    );
  }

  protected getCodeItemSuc(resultItem: Array<CodeItemsApi>): void {
    resultItem.forEach(item => {
      const fn = this.codeItemFuncMap[item.codeType as keyof FcMapType] as FcType | undefined;
      if (fn) fn(item.codesArray);
    });
  }

  protected codesArrayForEach(codesArray: Array<CodesArrayItem>): Array<KeyValueType> {
    const list: Array<KeyValueType> = [];
    codesArray.forEach(item => {
      const key = this.activeLangValue === AiConstLibrary.ar ? item.arabItemName : item.englishItemName;
      const kvObj = { key, value: item.codeItemValue };
      list.push(kvObj);
    });
    return list;
  }

  protected successTips = (status: string, taskName = ''): void => {
    const name = taskName ? `"${taskName}"  ` : '';
    this.messageService.success(name + ' ' + translate(status));
  };

  protected errorTips = (status: string, taskName = '', errMsg?:string): void => {
    const name = taskName ? `"${taskName}"  ` : '';
    this.messageService.error(name + ' ' + (errMsg || translate(status)));
  };

  protected taskShowLoading(): void {
    this.loadingService.startLoader('add-edit-task');
  }

  protected taskHideLoading(): void {
    this.loadingService.stopLoader('add-edit-task');
  }

  ngOnDestroy(): void {
    if (this.codeItemSub$) {
      this.codeItemSub$.unsubscribe();
    }
  }
}
