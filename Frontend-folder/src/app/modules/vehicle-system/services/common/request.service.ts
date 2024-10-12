import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestfulCodeItemsApi } from '../../interfaces/key-value-type';

@Injectable()
export class CommonHttpRequest {
  constructor(
    private httpClient: HttpClient,
  ) { }

  getCodeItemsApi(): Observable<RestfulCodeItemsApi> {
    return this.httpClient.get<RestfulCodeItemsApi>('/lpr/system/queryCodeItemByType');
  }
}
