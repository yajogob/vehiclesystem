import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SiteSelectorBehaviorSubject } from './components/site-selector/site-selector.BehaviorSubject';
import { PathLib } from './libs/path-library';
import { CommonHttpRequest } from './services/common/request.service';
import { CodeItemService, GlobalSubscriptionService } from './services/global-subscription.service';
import { I18nService } from './utils/i18n.service';

@Component({
  selector: 'vs-vehicle-system',
  templateUrl: './vehicle-system.component.html',
  styleUrls: ['./vehicle-system.component.scss'],
})
export class VehicleSystemComponent implements OnInit {
  constructor(
    private i18nService: I18nService,
    private commonHttpRequest: CommonHttpRequest,
    private codeItemService: CodeItemService,
    private router: Router,
    private globalSubscriptionService: GlobalSubscriptionService,
    private siteSelectorBehaviorSubject: SiteSelectorBehaviorSubject,
  ) { }

  autoSize = 1;
  isShowBasicMap = false;
  isInit = false;

  /* Lifecycle function  -----start */
  ngOnInit(): void {
    this.i18nService.init();
    this.isInit = true;
    this.initHtmlSize();
    this.getCodeItemsApi();

    // watch router change
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setShowBasicMap(event.url);
      }
    });

    this.subPointerEvents();
    this.initBasicMap();
    this.siteSelectorBehaviorSubject.setOriginalSiteTree();

    window.addEventListener('resize', this.initHtmlSize);
  }
  /* Lifecycle function  -----end */


  /* custom function   -----start */
  initHtmlSize(): void {
    // html-font-size defaults to 10px at 1440;
    this.autoSize = window.innerWidth * 10 / 1440;
    document.documentElement.style.fontSize = `${this.autoSize.toFixed()}px`;
  }

  initBasicMap(): void {
    this.setShowBasicMap(this.router.url);
  }

  setShowBasicMap(url: string): void {
    if (url.indexOf('/') == 0) {
      url = url.substring(1);
    }
    this.isShowBasicMap = [PathLib.HOME, PathLib.ALERT, PathLib.VEHICLE_PROFILE].includes(url.split('?')[0] as PathLib);
  }

  getCodeItemsApi(): void {
    this.commonHttpRequest.getCodeItemsApi().subscribe(
      {
        next: res => {
          this.codeItemService.subject$.next({
            eventType: 'update-codeItems',
            data: res.result,
          });
        },
      },
    );
  }

  private subPointerEvents(): void {
    this.globalSubscriptionService.pointerEventsChange$.subscribe(res => {
      res ? this.isShowBasicMap = false : this.isShowBasicMap = true;
    });
  }
  /* custom function   -----end */
}
