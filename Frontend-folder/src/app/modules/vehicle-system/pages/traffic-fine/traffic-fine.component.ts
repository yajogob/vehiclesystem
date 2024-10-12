import { Component, OnDestroy, OnInit } from '@angular/core';
import { TimePeriod } from 'ngx-daterangepicker-material/daterangepicker.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription, finalize } from 'rxjs';
import { PageChangeEvent } from '../../components/pagination-grid';
import { Tool } from '../../components/toolbox';
import { DateKey } from '../../interfaces/key-value-type';
import { FineInfo, InTrafficFineSearch, OutTrafficFineSearch, PromiseOutTrafficFineSearch } from '../../interfaces/traffic-fine/traffic-fine';
import { MapService } from '../../services/map-event.service';
import { TrafficFineService } from '../../services/traffic-fine/traffic-fine.service';
import { I18nService } from '../../utils/i18n.service';
import { FineConstLibrary } from './libs/traffic-fine-const-library';

@Component({
  selector: 'vs-traffic-fine',
  templateUrl: './traffic-fine.component.html',
  styleUrls: ['./traffic-fine.component.scss'],
})
export class TrafficFineComponent implements OnInit, OnDestroy {
  fineDetailsData!: Array<OutTrafficFineSearch>;
  isShowFineDetails = false;
  inTrafficFineParams!: InTrafficFineSearch;
  pageNo = 1;
  pageSize = 20;
  dataTotal = 0;
  modalData = new FineInfo();
  toolSet = FineConstLibrary.toolSet;
  selectedDate!: TimePeriod | null;
  searchType!: string;
  wFull = false;
  toolboxHide = false;
  dateInputPosition = 'traffic-fine';
  language='';

  private businessToTool$!: Subscription;

  constructor(
    private trafficFineService: TrafficFineService,
    private i18nService: I18nService,
    private mapService: MapService,
    private loadingService: NgxUiLoaderService,
  ) {}

  ngOnInit(): void {
    this.language = this.i18nService.getLanguage();
    this.i18nService.getLanguageObservable().subscribe(lang => {
      this.language = lang;
    });
    this.mapService.subject.next({
      eventType: 'set-page-on-gomap',
      data: {type: '/traffic-fine'},
    });
    this.initSubject();
  }

  private initSubject(): void {
    this.businessToTool$ = this.trafficFineService.businessToToolBoxDateChange$.subscribe(params => {
      this.selectedDate = params?.curSelected as TimePeriod;
    });
  }

  searchEventEmit(event: InTrafficFineSearch): void {
    this.pageNo = 1;
    this.searchType = event.searchType as string;
    this.inTrafficFineParams = event;
    this.trafficFineSearch();
  }

  searchHeatMapEmit(event: InTrafficFineSearch): void {
    this.searchHeatMap(event);
  }

  pageInfoChange(event: PageChangeEvent): void {
    this.pageNo = event.pageNumber;
    this.trafficFineSearch();
  }

  expandListEvent(event: boolean): void {
    this.wFull = event;
    if (!event) {
      // Delay time and transition time synchronization (scss: transition: width 0.2s)
      setTimeout(() => {
        this.toolboxHide = event;
      },200);
      return;
    }
    this.toolboxHide = event;
  }

  onClickbackFn(tool: Tool): void {
    if (['fine', 'heatMap'].includes(tool.code || '')) {
      this.mapService.subject.next({
        eventType: 'set-trafficFine-map-view-type',
        data: {trafficFineViewType: tool.code},
      });
    }

    if (tool.code === 'heatMap') {
      this.dateInputPosition = 'traffic-fine-heat-map';
      this.isShowFineDetails = false;
    } else {
      this.dateInputPosition = 'traffic-fine';
      this.isShowFineDetails = true;
    }
  }

  selectedDateEmit(event : DateKey): void {
    this.trafficFineService.toolBoxToBusinessDateChange$.next(event);
  }

  private searchHeatMap(event: InTrafficFineSearch): void {
    delete event.searchType; // Just for front-end use, not for the server
    delete event.pageNo;
    delete event.pageSize;
    this.listShowLoading();
    this.trafficFineService.searchHeatMap(event)
      .pipe(finalize(() => this.listHideLoading()))
      .subscribe(
        {
          next: res => {
            // res Access map
            this.mapService.subject.next({
              eventType: 'set-trafficFine-map-site-location',
              data: {trafficFineLocation: res},
            });
          },
        },
      );
  }

  private trafficFineSearch(): void {
    delete this.inTrafficFineParams.searchType; // Just for front-end use, not for the server
    this.listShowLoading();
    this.inTrafficFineParams.pageNo = this.pageNo;
    this.inTrafficFineParams.pageSize = this.pageSize;
    this.trafficFineService.trafficFineSearch(this.inTrafficFineParams)
      .pipe(finalize(() => this.listHideLoading()))
      .subscribe(
        {
          next: res => {
            this.trafficFineSearchSuc(res);
          },
        },
      );
  }

  private trafficFineSearchSuc(res: PromiseOutTrafficFineSearch): void {
    this.isShowFineDetails = true;
    this.dataTotal = res.total || 0;
    this.fineDetailsData = res.data || [];
  }

  protected listShowLoading(): void {
    this.loadingService.startLoader('fine-search-loader');
  }

  protected listHideLoading(): void {
    this.loadingService.stopLoader('fine-search-loader');
  }

  ngOnDestroy(): void {
    this.businessToTool$ && this.businessToTool$.unsubscribe();
  }

  onPageSizeChange(event: number): void {
    this.pageSize = event;
  }

  onPageNoChange(event: number): void {
    this.pageNo = event;
    this.trafficFineSearch();
  }
}
