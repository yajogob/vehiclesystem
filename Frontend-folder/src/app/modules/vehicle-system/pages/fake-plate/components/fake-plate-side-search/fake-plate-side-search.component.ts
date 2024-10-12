import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import dayjs, { Dayjs } from 'dayjs/esm';
import { TimePeriod } from 'ngx-daterangepicker-material/daterangepicker.component';
import { Subscription } from 'rxjs';
import { SiteTreeNode } from 'src/app/modules/vehicle-system/components/site-selector/interfaces/http.response';
import { NotPartOfTheUAE } from 'src/app/modules/vehicle-system/libs/path-library';
import { FakePlateService } from 'src/app/modules/vehicle-system/services/fake-plate/fake-plate.service';
import { FakePlateSearchParams, GetFakePlateSearchParams } from '../../../../interfaces/fake-plate/fake-plate';
import { DateKey, KeyValueType } from '../../../../interfaces/key-value-type';

interface syncDataControlDataType {
  type: string,
  data: SiteTreeNode[] | TimePeriod | null
}

@Component({
  selector: 'vs-fake-plate-side-search',
  templateUrl: './fake-plate-side-search.component.html',
  styleUrls: [ './fake-plate-side-search.component.scss' ],
})
export class FakePlateSideSearchComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() activeLangValue = 'en';
  @Input() plateColorList: Array<KeyValueType> = [];
  @Input() fakeInformationStatusList: Array<KeyValueType> = [];
  @Input() fakeSearchTypeList: Array<KeyValueType> = [];
  filterFakeSearchTypeList: Array<KeyValueType> = [];
  @Input() regionList: Array<KeyValueType> = [];
  @Input() categoryList: Array<KeyValueType> = [];
  @Input() exactNumList: Array<KeyValueType> = [];
  @Output() getFakePlateTableListEmit: EventEmitter<GetFakePlateSearchParams> = new EventEmitter<GetFakePlateSearchParams>();
  @Output() syncDataControlEmit: EventEmitter<syncDataControlDataType> = new EventEmitter<syncDataControlDataType>();
  @Output() showDeviceTreeEmit: EventEmitter<null> = new EventEmitter<null>();
  @Output() regionChange: EventEmitter<KeyValueType | null> = new EventEmitter<KeyValueType | null>();

  fakePlateSearchForm!: UntypedFormGroup;
  currentDateTime!: string | Date; // current time
  selected: TimePeriod | null = null;
  timer!: NodeJS.Timer | null; // Timer
  isShowAdvancedSearch!: boolean; // Whether to show advanced search
  region!: string | null; // Region
  plateCategory!: string | null; // Plate category
  plateNumber!: string; // Plate number
  plateColor!: string | null; // Plate color
  // selectSearchType!: string | null // Select search type
  // informationStatus!: string | null // Information status
  // selectCamera!: string | null // Select camera
  siteSelectedList: Array<SiteTreeNode> = [];

  pageNo = 1; // Page number
  pageSize = 10; // Page size

  private endDateTime!: number | null;  // End time
  private startDateTime!: number | null;  // Start time
  private behavior$!: Subscription;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private fakePlateService: FakePlateService,
  ) {
  }

  ngOnInit(): void {
    this.initFormData();
    this.initSubject();
  }

  ngAfterViewInit(): void {
    this.getFakePlateTableList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fakeSearchTypeList']) {
      this.setFilterFakeSearchTypeList(false);
    }
  }

  /* ---------------------- methods ---------------------- */

  private initSubject(): void {
    this.behavior$ = this.fakePlateService.toolBoxToBusinessDateChange$.subscribe(dateParams => {
      if (dateParams.startDate && dateParams.endDate) {
        this.selected = {
          startDate: dayjs(dateParams.startDate),
          endDate: dayjs(dateParams.endDate),
        };
        this.startDateTime = dateParams.startDate;
        this.endDateTime = dateParams.endDate;
      }
    });
  }

  /**
   * Initializes the form data
   */
  resetForm(): void {
    this.fakePlateSearchForm.reset();
    this.fakePlateSearchForm.controls['exactNum'].enable();
    this.fakePlateSearchForm.patchValue({exactNum: '0'});
    this.initDateInputValue();
    this.getFakePlateTableList();
  }

  /**
   * Get form data
   */
  getFakePlateTableList(): void {
    const p =  this.fakePlateSearchForm.value;
    if(p.selectSearchType === '1' && (!p.region || !p.plateCategory || !p.plateNumber)) return;

    const fakePlateSearchParams: FakePlateSearchParams = new FakePlateSearchParams();
    const { informationStatus, plateCategory, plateColor, plateNumber, region, selectSearchType, sites } = this.fakePlateSearchForm.value;
    const exactNum = this.fakePlateSearchForm.controls['exactNum'].value;
    if (this.startDateTime) fakePlateSearchParams.startDateTime = this.startDateTime;
    if (this.endDateTime) fakePlateSearchParams.endDateTime = this.endDateTime;
    fakePlateSearchParams.informationStatus = informationStatus || '';
    fakePlateSearchParams.pageNo = 1;
    fakePlateSearchParams.pageSize = 10;
    fakePlateSearchParams.plateCategory = plateCategory || '';
    fakePlateSearchParams.exactNum = exactNum || 0;
    fakePlateSearchParams.plateColor = plateColor || '';
    fakePlateSearchParams.plateNumber = plateNumber || '';
    fakePlateSearchParams.region = region || '';
    fakePlateSearchParams.sites = sites || [];
    fakePlateSearchParams.selectSearchType = selectSearchType || '';
    this.getFakePlateTableListEmit.emit({ type: 'search', isNoDataBase: p.selectSearchType, data: fakePlateSearchParams });
  }

  changeCurrentRegion(data:KeyValueType): void {
    const flag = NotPartOfTheUAE.includes(data['key']);
    this.setFilterFakeSearchTypeList(flag);
    this.regionChange.emit(data);
  }

  clearRegion(): void {
    this.fakePlateSearchForm.patchValue({ plateCategory: null });
    this.regionChange.emit(null);
  }

  setFilterFakeSearchTypeList(flag:boolean): void {
    const copyList:Array<KeyValueType> = JSON.parse(JSON.stringify(this.fakeSearchTypeList));
    if (flag) {
      this.filterFakeSearchTypeList = copyList.filter(item => item['value'] !== '1');
    } else {
      this.filterFakeSearchTypeList = copyList;
    }
  }

  /**
   * Show advanced search
   */
  showAdvancedSearch(): void {
    this.isShowAdvancedSearch = !this.isShowAdvancedSearch;
  }

  searchTypeChange(type: {key: string, value: string}): void {
    if(type && type.value === '1') {
      this.fakePlateSearchForm.patchValue({'exactNum': '0'});
      this.fakePlateSearchForm.controls['exactNum'].disable();
      return;
    }
    this.fakePlateSearchForm.controls['exactNum'].enable();
  }

  // Display the site selection modal
  showSiteModal(): void {
    this.showDeviceTreeEmit.emit();
  }

  chooseCameraChange(event: Array<SiteTreeNode>): void {
    this.siteSelectedList = event;
    const params = { type: 'site', data: this.siteSelectedList };
    this.syncDataControlEmit.emit(params);
  }

  selectedDate(event: DateKey): void {
    if (event.startDate && event.endDate) {
      this.startDateTime = event.startDate;
      this.endDateTime = event.endDate;
    }
    this.releaseCurDate(event);
  }

  private releaseCurDate(event: DateKey): void {
    this.fakePlateService.businessToToolBoxDateChange$.next(event);
  }

  /* ---------------------- private methods ---------------------- */

  /**
   * Initialize the current time and time it
   */
  private getCurrentTime(): void {
    this.currentDateTime = new Date();
    this.timer = setInterval(() => {
      this.currentDateTime = new Date();
    }, 1000);
  }

  private formatTime = (date: Dayjs): number | null => {
    if (date) {
      const localTime = `${date.year()}-${date.month() + 1}-${date.date()} ${date.hour()}:${date.minute()}:${date.second()}`;
      return new Date(localTime).getTime();
    } else {
      return null;
    }
  };

  private initDateInputValue(): void {
    this.selected = this.defDateRange();
    this.startDateTime = this.formatTime(this.selected.startDate);
    this.endDateTime = this.formatTime(this.selected.endDate);
  }

  private initFormData(): void {
    this.fakePlateSearchForm = this.formBuilder.group({
      region: null,
      plateCategory: null,
      plateNumber: '',
      plateColor: null,
      selectSearchType: null,
      informationStatus: null,
      exactNum: ['0'],
      sites: [],
    });
    this.initDateInputValue();
    this.getCurrentTime();
  }

  private defDateRange = (): TimePeriod => {
    return {
      startDate: dayjs().subtract(0, 'days').set('hours', 0).set('minutes', 0).set('seconds', 0),
      endDate: dayjs().subtract(0, 'days').set('hours', 23).set('minutes', 59).set('seconds', 59),
    };
  };

  syncDataControlFunc(event: { type: string, data: DateKey | SiteTreeNode[]}): void {
    if (event.type === 'site') {
      this.siteSelectedList = event.data as SiteTreeNode[];
      this.fakePlateSearchForm.patchValue({ sites: event.data });
    }
  }

  ngOnDestroy(): void {
    this.behavior$ && this.behavior$.unsubscribe();
  }
}
