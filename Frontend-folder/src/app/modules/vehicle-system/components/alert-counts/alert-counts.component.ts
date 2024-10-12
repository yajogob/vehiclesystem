import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { finalize, tap } from 'rxjs';
import { TrafficParams } from '../../interfaces/home/http.params';
import { AlertCounts, GetAlertCountsRes } from '../../interfaces/home/http.response';
import { AlertEchartsAccessType, TRAFFICMenuList } from '../../interfaces/rbac';
import { AlertEchartsAccess, AllResourceList } from '../../libs/path-library';
import { HomeHttpRequest } from '../../services/home/http.service';
import { LoggerService } from '../../utils/logger.service';

@Component({
  selector: 'vs-alert-counts',
  templateUrl: './alert-counts.component.html',
  styleUrls: ['./alert-counts.component.scss'],
})
export class AlertCountsComponent implements OnChanges {
  @Input() alertCountParams!:TrafficParams;
  @Output() checkSearch = new EventEmitter<string>();

  allResourceList = AllResourceList;
  alertEchartsAccess: AlertEchartsAccessType = AlertEchartsAccess;
  countMapTimer?: number | null;
  countMap: AlertCounts = {
    watchListAlerts: '0',
    behavioralAlerts: '0',
    geofenceAlerts: '0',
  };

  constructor(
    private homeHttpRequest: HomeHttpRequest,
    private logger: LoggerService,
  ) {}


  /* Lifecycle function  -----start */
  ngOnChanges(): void {
    this.periodicUpdateCountMap();
  }
  /* Lifecycle function  -----end */


  /* custom function   -----start */
  resetCountMap():void {
    this.countMap = {
      watchListAlerts: '0',
      behavioralAlerts: '0',
      geofenceAlerts: '0',
    };
  }

  periodicUpdateCountMap():void {
    if (this.countMapTimer) {
      window.clearTimeout(this.countMapTimer);
      this.countMapTimer = null;
    }
    this.getAlertCounts();
  }

  getAlertCounts():void {
    const response = this.homeHttpRequest.getAlertCountsApi(this.alertCountParams);
    response.pipe(
      tap({
        error: () => {
          this.resetCountMap();
        },
      }),
      finalize(() => {
        this.countMapTimer = window.setTimeout(() => {
          this.periodicUpdateCountMap();
        }, 300000);
      }),
    ).subscribe((data:GetAlertCountsRes) => {
      if (data.status === 200) {
        this.countMap = data.result;
      } else {
        this.resetCountMap();
      }
    });
  }

  countSum(): number {
    let allCounts = 0;
    const meunListRes = JSON.parse(localStorage.getItem('menuList') || '[]');
    Object.keys(this.countMap).forEach(key => {
      meunListRes.forEach((ele: TRAFFICMenuList) => {
        if(this.alertEchartsAccess[key as keyof AlertEchartsAccessType] === ele.uriSet) {
          allCounts += Number(this.countMap[key as keyof AlertCounts]);
        }
      });
    });
    return allCounts;
  }

  checkAlertSearch(type:string):void {
    this.checkSearch.emit(type);
  }
  /* custom function   -----end */
}
