import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AllAlertsSearchParams, QuerySitesParams } from '../../interfaces/basic-map/http.params';
import {
  AllAlertsSearchRes,
  CameraInfoRes,
  HistoryStreamRes,
  LatestAlertRes,
  LatestCaptureRes,
  QueryCamerasRes,
  QuerySitesRes,
} from '../../interfaces/basic-map/http.response';

@Injectable()
export class MapHttpRequest {
  constructor(
    private http: HttpClient,
  ) { }

  public getAllSitesApi(params: QuerySitesParams):Observable<QuerySitesRes> {
    return this.http.post<QuerySitesRes>('/lpr/sites/querySites', params);
  }

  public getAllCamerasApi(params: QuerySitesParams):Observable<QueryCamerasRes> {
    return this.http.post<QueryCamerasRes>('/lpr/camera/queryCameras', params);
  }

  public getAllAlertsApi(params: AllAlertsSearchParams):Observable<AllAlertsSearchRes> {
    return this.http.post<AllAlertsSearchRes>('/lpr/alert/allAlertsSearch', params);
  }

  public getLatestAlertApi(params: object):Observable<LatestAlertRes> {
    return this.http.post<LatestAlertRes>('/lpr/alert/getLatestAlertInfo', params);
  }

  public getLatestCaptureApi(cameraCode: string):Observable<LatestCaptureRes> {
    const params = new HttpParams().set('cameraCode', cameraCode);
    return this.http.get<LatestCaptureRes>('/lpr/traffic/getLatestCapture', {params});
  }

  public getCameraInfoApi(params: object):Observable<CameraInfoRes> {
    return this.http.post<CameraInfoRes>('/lpr/alert/getCameraInfoByCameraCode', params);
  }

  public getHistoryStreamByIdApi(params: object):Observable<HistoryStreamRes> {
    return this.http.post<HistoryStreamRes>('/lpr/behavior/queryStreamUrl', params);
  }

  public getCountAlertBySiteCode(params: AllAlertsSearchParams):Observable<AllAlertsSearchRes> {
    return this.http.post<AllAlertsSearchRes>('/lpr/alert/countAlertBySiteCode', params);
  }
}
