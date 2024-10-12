import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  VehicleProfileListParams,
  VehicleProfileListResponse,
  VehicleProfileTimeLineParams,
  VehicleProfileTimeLineResponse,
} from '../../interfaces/vehicle-profile/vehicle-profile';

@Injectable()
export class VehicleProfileService {
  constructor(
    private httpClient: HttpClient,
  ) {
  }

  /**
   * Get vehicle profile list
   * @param params
   */
  getVehicleProfileList = (params: VehicleProfileListParams): Observable<VehicleProfileListResponse> => {
    return this.httpClient.post<VehicleProfileListResponse>('/lpr/traffic/vehicleProfileSearch', params);
  };

  /**
   * Get vehicle profile timeline list
   * @param params
   */
  getVehicleProfileTimeLineList = (params: VehicleProfileTimeLineParams): Observable<VehicleProfileTimeLineResponse> => {
    return this.httpClient.post<VehicleProfileTimeLineResponse>('/lpr/traffic/getVehicleProfileDetails', params);
  };
}
