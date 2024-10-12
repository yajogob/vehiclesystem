import { Component, Input, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { TrafficParams } from '../../../../interfaces/home/http.params';
import { StatisticsTrafficSitesRes, TrafficSites } from '../../../../interfaces/home/http.response';
import { HomeHttpRequest } from '../../../../services/home/http.service';
import { LoggerService } from '../../../../utils/logger.service';

@Component({
  selector: 'vs-traffic-sites',
  templateUrl: './traffic-sites.component.html',
  styleUrls: ['./traffic-sites.component.scss'],
})
export class TrafficSitesComponent implements OnInit {
  @Input() trafficSitesParams!:TrafficParams;

  countMap: TrafficSites = {
    hotels: 0,
    malls: 0,
    gantry: 0,
    streetCameras: 0,
    total: 0,
    totalCamera: 0,
  };

  constructor(
    private homeHttpRequest: HomeHttpRequest,
    private logger: LoggerService,
  ) {}


  /* Lifecycle function  -----start */
  ngOnInit(): void {
    this.getTrafficSites();
  }
  /* Lifecycle function  -----end */


  /* custom function   -----start */
  resetCountMap():void {
    this.countMap = {
      hotels: 0,
      malls: 0,
      gantry: 0,
      streetCameras: 0,
      total: 0,
      totalCamera: 0,
    };
  }

  getTrafficSites():void {
    const response = this.homeHttpRequest.postTrafficSitesApi(this.trafficSitesParams);
    response.pipe(
      tap({
        error: () => {
          this.resetCountMap();
        },
      }),
    ).subscribe((data:StatisticsTrafficSitesRes) => {
      if (data.status === 200) {
        this.countMap = data.result;
      } else {
        this.resetCountMap();
      }
    });
  }
  /* custom function   -----end */
}
