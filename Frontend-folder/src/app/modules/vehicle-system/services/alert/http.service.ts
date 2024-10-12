import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  BehavioralAlertsParams,
  CreateTaskParams,
  GeofenceAlertsParams,
  InNoNumberPlate,
  OutNoNumberPlateListObservable,
  WatchlistAlertsParams,
} from '../../interfaces/alert/http.params';
import {
  BehavioralAlertsSearchRes,
  CreateAlertTaskRes,
  GeofenceAlertsSearchRes,
  WatchListAlertsSearchRes,
} from '../../interfaces/alert/http.response';
import { DateKey } from '../../interfaces/key-value-type';

@Injectable()
export class AlertHttpRequest {
  toolBoxToBusinessDateChange$: Subject<DateKey> = new Subject<DateKey>();
  businessToToolBoxDateChange$: Subject<DateKey> = new Subject<DateKey>();

  constructor(
    private http: HttpClient,
  ) { }

  public postWatchListAlertSearchApi(params: WatchlistAlertsParams):Observable<WatchListAlertsSearchRes> {
    const copyParams = JSON.parse(JSON.stringify(params));
    if (copyParams.pageNo * copyParams.pageSize > 10000) {
      copyParams.pageSize = 10000 - (copyParams.pageNo - 1) * copyParams.pageSize;
    }
    return this.http.post<WatchListAlertsSearchRes>('/lpr/alert/watchListAlertsSearch', copyParams);
  }

  public postBehavioralAlertsSearchApi(params: BehavioralAlertsParams):Observable<BehavioralAlertsSearchRes> {
    const copyParams = JSON.parse(JSON.stringify(params));
    if (copyParams.pageNo * copyParams.pageSize > 10000) {
      copyParams.pageSize = 10000 - (copyParams.pageNo - 1) * copyParams.pageSize;
    }
    return this.http.post<BehavioralAlertsSearchRes>('/lpr/alert/behavioralAlertsSearch', copyParams);
  }

  public postGeofenceAlertsSearchApi(params: GeofenceAlertsParams):Observable<GeofenceAlertsSearchRes> {
    const copyParams = JSON.parse(JSON.stringify(params));
    copyParams.taskName = copyParams.taskName.trim();
    if (copyParams.pageNo * copyParams.pageSize > 10000) {
      copyParams.pageSize = 10000 - (copyParams.pageNo - 1) * copyParams.pageSize;
    }
    return this.http.post<GeofenceAlertsSearchRes>('/lpr/alert/geofenceAlertsSearch', copyParams);
  }

  public saveWatchListTaskApi(params: CreateTaskParams):Observable<CreateAlertTaskRes> {
    return this.http.post<CreateAlertTaskRes>('/lpr/algorithms/watchListTaskSave', params);
  }

  public saveBehavioralTaskApi(params: CreateTaskParams):Observable<CreateAlertTaskRes> {
    return this.http.post<CreateAlertTaskRes>('/lpr/algorithms/behavioralTaskSave', params);
  }

  public saveGeofenceTaskApi(params: CreateTaskParams):Observable<CreateAlertTaskRes> {
    return this.http.post<CreateAlertTaskRes>('/lpr/algorithms/geofenceTaskSave', params);
  }

  public searchNoNumberPlate(params: InNoNumberPlate):Observable<OutNoNumberPlateListObservable> {
    const copyParams = JSON.parse(JSON.stringify(params));
    if (copyParams.pageNo * copyParams.pageSize > 10000) {
      copyParams.pageSize = 10000 - (copyParams.pageNo - 1) * copyParams.pageSize;
    }
    return this.http.post<OutNoNumberPlateListObservable>('/lpr/traffic/noNumberPlate/search', copyParams);
  }

  public deleteNoNumberPlate(id: string | number):Observable<OutNoNumberPlateListObservable> {
    return this.http.delete<OutNoNumberPlateListObservable>('/lpr/traffic/noNumberPlate/delete/' + id);
  }

  public deleteGeofenceAlert(id: string | number):Observable<OutNoNumberPlateListObservable> {
    return this.http.delete<OutNoNumberPlateListObservable>('/lpr/alert/geofenceAlert/deleteById/' + id);
  }

  public deleteWatchlistAlert(id: string | number):Observable<OutNoNumberPlateListObservable> {
    return this.http.delete<OutNoNumberPlateListObservable>('/lpr/alert/watchlistAlert/deleteById/' + id);
  }

  // fake
  public deletebehavioralAlert(id: string | number):Observable<OutNoNumberPlateListObservable> {
    return this.http.delete<OutNoNumberPlateListObservable>('/lpr/alert/behavioralAlert/deleteById/' + id);
  }
}
