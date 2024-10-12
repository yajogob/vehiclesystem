import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  LiveTrafficParams,
  TrafficParams,
} from '../../interfaces/home/http.params';
import {
  BehavioralAlertsStatisticsByTimeRes,
  BehavioralAlertsStatisticsRes,
  GetAlertCountsRes,
  GetVehicleCountRes,
  HomePageTopAlertRes,
  StatisticsLiveTrafficRes,
  StatisticsTrafficSitesRes,
} from '../../interfaces/home/http.response';

@Injectable()
export class HomeHttpRequest {
  constructor(
    private http: HttpClient,
  ) {}

  private topAlertParams = {
    pageNo: 1,
    pageSize: 3,
  };

  public postHomePageWatchListAlertApi():Observable<HomePageTopAlertRes> {
    return this.http.post<HomePageTopAlertRes>('/lpr/alert/getHomePageWatchListAlert', this.topAlertParams);
  }

  public postHomePageBehavioralAlerttApi():Observable<HomePageTopAlertRes> {
    return this.http.post<HomePageTopAlertRes>('/lpr/alert/getHomePageBehavioralAlert', this.topAlertParams);
  }

  public postHomePageGeofenceAlertApi():Observable<HomePageTopAlertRes> {
    return this.http.post<HomePageTopAlertRes>('/lpr/alert/getHomePageGeofenceAlert', this.topAlertParams);
  }

  public postVehicleCountApi(params: TrafficParams):Observable<GetVehicleCountRes> {
    return this.http.post<GetVehicleCountRes>('/lpr/traffic/getVehicleCount', params);
  }

  public getAlertCountsApi(params: TrafficParams):Observable<GetAlertCountsRes> {
    return this.http.post<GetAlertCountsRes>('/lpr/alert/getAlertCounts', params);
  }

  public postTrafficSitesApi(params: TrafficParams):Observable<StatisticsTrafficSitesRes> {
    return this.http.post<StatisticsTrafficSitesRes>('/lpr/traffic/statisticsTrafficSites', params);
  }

  public postLiveTrafficApi(params: LiveTrafficParams):Observable<StatisticsLiveTrafficRes> {
    return this.http.post<StatisticsLiveTrafficRes>('/lpr/traffic/statisticsLiveTraffic', params);
  }

  public postBehavioralAlertApi(params: TrafficParams):Observable<BehavioralAlertsStatisticsRes> {
    return this.http.post<BehavioralAlertsStatisticsRes>('/lpr/alert/behavioralAlertsStatistics', params);
  }

  public postBehavioralAlertByTimeApi(params: TrafficParams):Observable<BehavioralAlertsStatisticsByTimeRes> {
    return this.http.post<BehavioralAlertsStatisticsByTimeRes>('/lpr/alert/behavioralAlertsStatisticsByTime', params);
  }
}
