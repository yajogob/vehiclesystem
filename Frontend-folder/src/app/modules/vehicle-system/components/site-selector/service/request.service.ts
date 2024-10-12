import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CamerasListRes,
  QueryCamerasByCodeParams,
  QueryCamerasByNameParams,
  QueryCamerasBysiteCodes,
  QuerySitesParams,
  SiteTreeRes,
  SitesListRes,
} from '../interfaces/http.response';

@Injectable()
export class SiteHttpRequest {
  constructor(
    private http: HttpClient,
  ) {}


  public queryAllLocationsApi():Observable<SiteTreeRes> {
    return this.http.post<SiteTreeRes>('/lpr/region/queryLocations', {});
  }

  public getAllCameraApi(username:string):Observable<SiteTreeRes> {
    return this.http.get<SiteTreeRes>(`/lpr/getUserCamera/${username}`, {});
  }

  public queryCameraInfoBySitesApi(params:QueryCamerasByCodeParams):Observable<CamerasListRes> {
    return this.http.post<CamerasListRes>('/lpr/region/queryCameraInfoBySites', params);
  }

  public querySiteInfoBySiteNameApi(params: QuerySitesParams):  Observable<SitesListRes> {
    return this.http.post<SitesListRes>('/lpr/region/querySiteInfoBySiteName', params);
  }

  public queryCameraInfoByCameraNameApi(params: QueryCamerasByNameParams): Observable<CamerasListRes> {
    return this.http.post<CamerasListRes>('/lpr/region/queryCameraInfoByCameraName', params);
  }

  public queryCameraInfoBySiteCodesApi(params: QueryCamerasBysiteCodes): Observable<CamerasListRes> {
    return this.http.post<CamerasListRes>('/lpr/region/queryCamerasBySiteCodes', params);
  }
}
