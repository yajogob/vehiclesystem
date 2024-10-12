import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TimePeriod } from 'ngx-daterangepicker-material/daterangepicker.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription, finalize } from 'rxjs';
import {
  GetTrafficSearchListParams,
  TrafficSearchList,
  TrafficSearchListParams,
  TrafficSearchListResponse,
} from 'src/app/modules/vehicle-system/interfaces/traffic-search/traffic-search';
import { SiteTreeNode } from '../../components/site-selector/interfaces/http.response';
import { ToolboxComponent } from '../../components/toolbox/toolbox.component';
import { DateKey, customPositionType } from '../../interfaces/key-value-type';
import { MessageService } from '../../services/common/message.service';
import { TrafficSearchService } from '../../services/traffic-search/traffic-search.service';
import { I18nService } from '../../utils/i18n.service';
import { SideSearchComponent } from './components/side-search/side-search.component';

@Component({
  selector: 'vs-traffic-search',
  templateUrl: './traffic-search.component.html',
})
export class TrafficSearchComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('sideSearch') sideSearch: SideSearchComponent | undefined;
  @ViewChild('vsToolbox') vsToolbox: ToolboxComponent | undefined;

  trafficSearchParams = new TrafficSearchListParams();
  trafficSearchTableListInfo!: TrafficSearchList | null;
  selectedDate!: TimePeriod | null;
  showLocationFlag=false;
  customPosition!: customPositionType;
  language = 'en';
  pageSize = 20;

  private businessToTool$!: Subscription;

  constructor(
    private trafficSearchService: TrafficSearchService,
    private loadingService: NgxUiLoaderService,
    private messageService: MessageService,
    private i18nService: I18nService,
  ) {
  }

  /* ---------------------- life cycle ---------------------- */
  ngOnInit(): void {
    this.setCustomPosition();
    this.taskDestroyLoading();
    this.initSubject();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      document.addEventListener("fullscreenchange", () => {
        if (document.fullscreenElement) {
          const obj = this.customPosition;
          obj.bottom = '-22rem';
          this.customPosition = obj;
        } else {
          const obj = this.customPosition;
          obj.bottom = '-16.6rem';
          this.customPosition = obj;
        }
      });
    }, 0);
  }

  /* ---------------------- public methods ---------------------- */
  // get a traffic search list
  private setCustomPosition(): void {
    this.language = this.i18nService.getLanguage();
    if(this.language === 'en') {
      this.customPosition = {
        position: 'fixed',
        bottom: '-16.6rem',
        left: '16rem',
      };
    }
    if(this.language === 'ar') {
      this.customPosition = {
        position: 'fixed',
        bottom: '-16.6rem',
        left: '-16.6rem',
      };
    }
  }

  onPageSizeChange(event:number):void {
    this.pageSize = event;
    this.trafficSearchParams.pageSize = this.pageSize;
  }

  async getTrafficSearchList(event: GetTrafficSearchListParams): Promise<void> {
    this.taskShowLoading();
    switch (event.type) {
      case 'sort':
        typeof event.data === 'string' && (this.trafficSearchParams.dir = event.data);
        break;
      case 'page':
        typeof event.data === 'number' && (this.trafficSearchParams.pageNo = event.data);
        break;
      case 'search':
        if (typeof event.data === 'object') {
          this.trafficSearchParams = event.data;
        }
        break;
    }
    this.trafficSearchService.getTrafficSearchTableList(this.trafficSearchParams).pipe(
      finalize(() => {
        this.taskHideLoading();
      }),
    ).subscribe((data: TrafficSearchListResponse) => {
      if (data?.result) {
        this.trafficSearchTableListInfo = data.result;
      } else {
        this.trafficSearchTableListInfo = null;
        data.message && this.messageService.error(data.message);
      }
    });
  }

  syncDataControlEmit(event: { type: string, data: TimePeriod | null | SiteTreeNode[] }): void {
    if (event.type === 'date') {
      this.selectedDate = event.data as TimePeriod;
    }
  }

  onSelectedDateEmit(event: DateKey): void {
    this.trafficSearchService.toolBoxToBusinessDateChange$.next(event);
  }

  showDeviceTree():void {
    this.vsToolbox?.showDeviceTree();
  }

  // Hide <vs-screenful> when location-select is visibled
  changeLocationVisible(flag: boolean):void {
    this.showLocationFlag = flag;
  }

  /* ---------------------- private methods ---------------------- */
  private initSubject(): void {
    this.businessToTool$ = this.trafficSearchService.businessToToolBoxDateChange$.subscribe(params => {
      this.selectedDate = params?.curSelected as TimePeriod;
    });
  }

  // show loading
  private taskShowLoading(): void {
    this.loadingService.startLoader('loader-traffic-search');
  }

  // hide loading
  private taskHideLoading(): void {
    this.loadingService.stopLoader('loader-traffic-search');
  }

  // destroy loading
  private taskDestroyLoading(): void {
    this.loadingService.destroyLoaderData('loader-traffic-search');
  }

  ngOnDestroy(): void {
    this.businessToTool$ && this.businessToTool$.unsubscribe();
  }
}
