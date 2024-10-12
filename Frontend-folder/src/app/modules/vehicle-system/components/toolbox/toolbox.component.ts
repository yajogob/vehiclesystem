import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import dayjs, { Dayjs } from 'dayjs/esm';
import localeData from 'dayjs/esm/plugin/localeData';
import updateLocale from 'dayjs/esm/plugin/updateLocale';
import utc from 'dayjs/esm/plugin/utc';
import { ChosenDate, TimePeriod } from 'ngx-daterangepicker-material/daterangepicker.component';
import { Subscription } from 'rxjs';
import { CustomRanges, SelectType } from 'src/app/modules/vehicle-system/interfaces/key-value-type';
import { AllResourceList } from 'src/app/modules/vehicle-system/libs/path-library';
import { DateKey, customPositionType } from '../../interfaces/key-value-type';
import { AiConstLibrary } from '../../pages/ai-algorithm/libs/ai-const-library';
import { I18nService } from '../../utils/i18n.service';
import { SiteTreeNode } from '../site-selector/interfaces/http.response';
import { SiteSelectorComponent } from '../site-selector/site-selector.component';

export interface Tool {
  accessName?: string,
  code?: string,
  category: string,
  value: string,
  arrowIcon: boolean
}
@Component({
  selector: 'vs-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.scss'],
})
export class ToolboxComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('siteSelector') siteSelector: SiteSelectorComponent | undefined;
  @Input() dtRange: string[] = ['site', 'camera'];
  @Input() title = 'Traffic';
  @Input() disableLocation = false;
  @Input() disableDate = false;
  @Input() selectedList: SiteTreeNode[] = [];
  @Input() toolSet: Tool[] = [];
  @Input() disableAnimation = false;
  @Input() selectedDate: TimePeriod | null = {
    startDate: dayjs().startOf('day'),
    endDate: dayjs().endOf('day'),
  };

  @Input() customPosition!: customPositionType;
  @Input() dateInputPosition = '';
  @Input() defSelectAll = false;
  @Input() timePicker = true;
  @Input() show24Time = false;
  @Input() dateLimit = 1094;
  @Input() ranges: CustomRanges[] = [];
  @Output() readonly confirmEmit = new EventEmitter<SiteTreeNode[]>();
  @Output() onCallback = new EventEmitter<Tool>();
  @Output() onClickback = new EventEmitter<Tool>();
  @Output() selectedDateEmit: EventEmitter<DateKey> = new EventEmitter<DateKey>();
  @Output() showDeviceTreeEvent: EventEmitter<null> = new EventEmitter<null>();
  @Output() changeLocationVisible: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() changeLevel2SelectVisible: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() changeDateSelectVisible: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() changeSelectedEmit: EventEmitter<string> = new EventEmitter<string>();

  allResourceList = AllResourceList;
  @Input() showSelect = false;
  @Input() selectTitle = 'vs.aiAlgorithm.algorithm';
  @Input() selectedLabel = 'vs.aiAlgorithm.task';
  @Input() selectWidth = '54rem';
  @Input() selectOptions: Array<SelectType> = [
    // {label: 'vs.aiAlgorithm.behavioral', value: AiConstLibrary.behavioral, accessName: this.allResourceList.BehavioralListTask},
    {label: 'vs.aiAlgorithm.watchList', value: AiConstLibrary.watchList, accessName: this.allResourceList.WatchListListTask},
    {label: 'vs.aiAlgorithm.geofence', value: AiConstLibrary.geofenceList, accessName: this.allResourceList.GeofenceListTask},
    {label: 'vs.aiAlgorithm.whiteList', value: AiConstLibrary.whiteList, accessName: this.allResourceList.WhiteListListTask},
    // {label: 'vs.aiAlgorithm.gpuLpr', value: AiConstLibrary.gpuLpr},
  ];

  language!: string;
  dtVisible = false;
  selectedCount = 0;
  showDateSelect = false;
  selectedDateEvent?:DateKey;
  copySelectedDateEvent?: DateKey;
  activedRange = '';
  selected: TimePeriod = {
    startDate: dayjs().startOf('day'),
    endDate: dayjs().endOf('day'),
  };

  local = {
    direction: this.i18nService.getDirection(),
    monthNames: dayjs.months(),
    daysOfWeek: dayjs.weekdaysMin(),
    firstDay: dayjs.localeData().firstDayOfWeek(),
    displayFormat: this.timePicker ? (this.show24Time ? "MMM D, YYYY H:mm" : "MMM D, YYYY h:mm A") : "MMM D, YYYY",
  };

  private selectTranslate$!: Subscription;
  constructor(
    private i18nService: I18nService,
    protected translocoService: TranslocoService,
  ) {
    this.translocoService.langChanges$.subscribe(value => {
      this.updateLocale(value);
    });
  }

  ngOnInit(): void {
    document.addEventListener('keyup', this.closeLevel2SelectAndDateSelectByEsc);
    this.language = this.translocoService.getActiveLang();
    this.transloco();
  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.selectedDate) {
        const chosenDate = {
          chosenLabel: this.activedRange,
          startDate: this.selectedDate.startDate,
          endDate: this.selectedDate.endDate,
        };
        this.autoApplyChangeFn(chosenDate);
      }
    }, 300);
  }

  // eslint-disable-next-line class-methods-use-this
  disableFutureDate(date: Dayjs): boolean {
    return date.isAfter(dayjs(), 'day');
  }

  private updateLocale = (value: string): void => {
    dayjs.extend(localeData);
    dayjs.extend(updateLocale);
    dayjs.extend(utc);
    dayjs.locale(value);
  };

  private transloco(): void {
    this.selectOptions.forEach(e => {
      this.selectTranslate$ = this.translocoService.selectTranslate(`${e.label}`).subscribe(value => {
        e.label = value;
      });
    });
  }

  ngOnDestroy(): void {
    if(this.selectTranslate$) {
      this.selectTranslate$.unsubscribe();
    }
  }

  closeLevel2SelectAndDateSelectByEsc = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      this.changeLevel2SelectVisible.emit(false);
      this.showDateSelect = false;
      this.changeDateSelectVisible.emit(false);
    }
  };

  showDeviceTree(): void {
    this.dtVisible = true;
    this.showDeviceTreeEvent.emit();
    this.changeLocationVisible.emit(true);
  }

  closeDeviceTree(): void {
    this.dtVisible = false;
    this.changeLocationVisible.emit(false);
  }

  setShowDateSelect(): void {
    this.showDateSelect = true;
    this.changeDateSelectVisible.emit(true);
  }

  closeDateSelect(): void {
    if (this.copySelectedDateEvent && this.copySelectedDateEvent.curSelected) {
      this.selectedDateEvent = this.copySelectedDateEvent;
      this.selected = this.copySelectedDateEvent.curSelected;
      this.setActivedRange(this.selected);
    }
    this.showDateSelect = false;
    this.changeDateSelectVisible.emit(false);
  }

  changeRange(range:string, data?:TimePeriod): void {
    this.activedRange = range;
    if (data) {
      this.selected = data;
      const chosenDate = {
        chosenLabel: this.activedRange,
        startDate: data.startDate,
        endDate: data.endDate,
      };
      this.autoApplyChangeFn(chosenDate);
    }
  }

  setActivedRange(data: TimePeriod): void {
    for (let i = 0; i < this.ranges.length; i++) {
      const item = this.ranges[i];
      const key = Object.keys(item)[0];
      const value = item[key];
      if (value) {
        const dataStart = data.startDate.valueOf();
        const dataEnd = data.endDate.valueOf();
        const itemStart = value.startDate.valueOf();
        const itemEnd = value.endDate.valueOf();
        if (dataStart === itemStart && dataEnd === itemEnd) {
          this.activedRange = key;
          break;
        } else {
          this.activedRange = 'Custom';
        }
      }
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

  autoApplyChangeFn(ev:ChosenDate): void {
    const curSelected = {
      startDate: ev.startDate,
      endDate: ev.endDate,
    };
    this.selected = curSelected;
    this.setActivedRange(curSelected);
    const selectedDateEvent = {
      curSelected,
      startDate: this.formatTime(ev.startDate),
      endDate: this.formatTime(ev.endDate),
      activedTab: this.activedRange,
      selectedDateLabel: ev.chosenLabel || this.activedRange,
    };
    this.selectedDateEvent = selectedDateEvent;
  }

  dateSelectReset(): void {
    this.copySelectedDateEvent = this.selectedDateEvent;
    const defaultDate = this.selectedDate || {
      startDate: dayjs().startOf('day'),
      endDate: dayjs().endOf('day'),
    };
    this.selected = defaultDate;
    this.setActivedRange(this.selected);
    const chosenDate = {
      chosenLabel: this.activedRange,
      startDate: this.selected.startDate,
      endDate: this.selected.endDate,
    };
    this.autoApplyChangeFn(chosenDate);
  }

  dateSelectDone(): void {
    this.copySelectedDateEvent = this.selectedDateEvent;
    this.selectedDateEmit.emit(this.selectedDateEvent);
    this.closeDateSelect();
  }

  selectCountOn(num:number): void {
    this.selectedCount = num;
  }

  handleDone():void {
    // trigger a method in a component(<vs-site-selector>)
    this.siteSelector?.confirmSelected();
    this.changeLocationVisible.emit(false);
  }

  handleReset():void {
    // trigger a method in a component(<vs-site-selector>)
    this.siteSelector?.resetTree();
  }

  selectorConfirmOn(data: SiteTreeNode[]): void {
    this.confirmEmit.emit(data);
  }

  handleClickTool(tool: Tool): void {
    this.onClickback.emit(tool);
  }

  onSelectedDateChange($event: DateKey): void {
    this.selectedDateEmit.emit($event);
  }

  closeLevel2Selected(): void {
    this.changeLevel2SelectVisible.emit(false);
  }

  changeSelect(taskValue: string): void {
    this.changeSelectedEmit.emit(taskValue);
    this.closeLevel2Selected();
  }
}
