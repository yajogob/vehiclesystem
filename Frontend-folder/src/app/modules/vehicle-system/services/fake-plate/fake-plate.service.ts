import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  FakePlateSearchParams,
  FakePlateSearchResponse,
  OutTrafficCheckPlate,
  checkFakePlateParams,
  checkFakePlateResponse,
} from '../../interfaces/fake-plate/fake-plate';
import { DateKey } from '../../interfaces/key-value-type';

@Injectable()
export class FakePlateService {
  toolBoxToBusinessDateChange$: BehaviorSubject<DateKey> = new BehaviorSubject<DateKey>({} as DateKey);
  businessToToolBoxDateChange$: BehaviorSubject<DateKey> = new BehaviorSubject<DateKey>({} as DateKey);

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  /**
   * Get fake plate list
   * @param params
   */
  getFakePlateTableList(params: FakePlateSearchParams): Observable<FakePlateSearchResponse> {
    return this.httpClient.post<FakePlateSearchResponse>('/lpr/algorithms/fakePlateSearch', params );
  }

  checkFakePlate(params: checkFakePlateParams): Observable<checkFakePlateResponse> {
    return this.httpClient.post<checkFakePlateResponse>('/lpr/algorithms/fakePlate/confirm', params );
  }

  trafficCheckPlate(params: FakePlateSearchParams): Observable<OutTrafficCheckPlate> {
    return this.httpClient.post<OutTrafficCheckPlate>('/lpr/traffic/vehicleProfileSearch/checkPlate', params );
  }
}
