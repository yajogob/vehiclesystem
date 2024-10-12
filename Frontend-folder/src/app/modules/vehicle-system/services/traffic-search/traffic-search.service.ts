import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DateKey } from '../../interfaces/key-value-type';
import { TrafficSearchListParams, TrafficSearchListResponse } from '../../interfaces/traffic-search/traffic-search';

@Injectable()
export class TrafficSearchService {
  toolBoxToBusinessDateChange$: BehaviorSubject<DateKey> = new BehaviorSubject<DateKey>({} as DateKey);
  businessToToolBoxDateChange$: BehaviorSubject<DateKey> = new BehaviorSubject<DateKey>({} as DateKey);

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  /**
   * Get traffic search table list
   * @param params
   */
  getTrafficSearchTableList(params: TrafficSearchListParams): Observable<TrafficSearchListResponse> {
    const copyParams = JSON.parse(JSON.stringify(params));
    if (copyParams.pageNo * copyParams.pageSize > 10000) {
      copyParams.pageSize = 10000 - (copyParams.pageNo - 1) * copyParams.pageSize;
    }
    return this.httpClient.post<TrafficSearchListResponse>('/lpr/traffic/search', copyParams);
  }
}
