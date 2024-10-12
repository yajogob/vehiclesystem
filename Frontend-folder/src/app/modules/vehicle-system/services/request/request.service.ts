import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AlgorithmOutputData,
  InAlgorithmsListSearch,
  InBehavioralTaskDelete,
  InBehavioralTaskSearch,
  InGeofenceTaskDetail,
  InGeofenceTaskSearch,
  InGpuLprTaskSave,
  InGpuLprTaskSearch,
  InWatchListTaskSave,
  InWatchListTaskSearch,
  InWhiteListTaskSearch,
  InWhitelistTaskDetail,
  InWhitelistTaskSave,
  OutAllDeviceData,
  Restful,
  RestfulOutAlgorithmsListSearch,
  RestfulOutBehavioralTaskSearch,
  RestfulOutGeoFenceTaskSearch,
  RestfulOutGeofenceTaskDetail,
  RestfulOutGpuLprCameraList,
  RestfulOutGpuLprTaskSearch,
  RestfulOutWatchListTaskSearch,
  RestfulOutWatchSearcDevice,
  RestfulOutWhitelistTaskDetail,
  RestfulOutWhitelistTaskSaveUpdate,
  RestfulWhitelistTaskSearch,
} from "../../interfaces/ai-algorithm/ai-algorithm";
import { CameraInfo } from '../../interfaces/basic-map/http.response';
import { InCameraDelete, InCameraSearch, RestfulOutCameraSearch } from '../../interfaces/camera-management/camera-management';
import {
  InCarRentalInfoListSearch,
  InCarRentalTransactions,
  InRentalCompanyDetailsSearch,
  InRentalCompanyListSearch,
  RestfulOutCarRentalInfoList,
  RestfulOutCarRentalTransactions,
  RestfulOutCompanyDetailsData,
  RestfulOutRentalCompanyList,
} from '../../interfaces/car-rental/car-rental';
import { InTrafficFineSearch, RestfulOutTrafficFineHeatmap, RestfulOutTrafficFineSearch } from '../../interfaces/traffic-fine/traffic-fine';
import { AiApiLibrary } from '../../pages/ai-algorithm/libs/ai-api-library';
import { RentalApiLibrary } from '../../pages/rental/libs/rental-api-library';
import { CameraApiLibrary } from '../../pages/settings/libs/camera-api-library';
import { TrafficFineApiLibrary } from '../../pages/traffic-fine/libs/traffic-fine-api-library';
export interface GetParams {
  [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
}

@Injectable()
export class RequestService {
  constructor(
    private httpClient: HttpClient,
  ) { }

  // Transportation fine inquiry
  trafficFineSearch(params: InTrafficFineSearch): Observable<RestfulOutTrafficFineSearch> {
    const p = new HttpParams({ fromObject: params as unknown as GetParams });
    return this.httpClient.get<RestfulOutTrafficFineSearch>(TrafficFineApiLibrary.trafficFineSearch, { params: p });
  }

  // heat map
  getTrafficFineHeatmap(params: InTrafficFineSearch): Observable<RestfulOutTrafficFineHeatmap> {
    const p = new HttpParams({ fromObject: params as unknown as GetParams });
    return this.httpClient.get<RestfulOutTrafficFineHeatmap>(TrafficFineApiLibrary.getTrafficFineHeatmap, { params: p });
  }

  // Query car rental company information
  rentalCompaniesListSearch(params: InRentalCompanyListSearch): Observable<RestfulOutRentalCompanyList> {
    const p = new HttpParams({ fromObject: params as unknown as GetParams });
    return this.httpClient.get<RestfulOutRentalCompanyList>(RentalApiLibrary.rentalCompaniesSearch, { params: p });
  }

  // Car rental company detailed information query
  rentalCompanyDetailSearch(params: InRentalCompanyDetailsSearch): Observable<RestfulOutCompanyDetailsData> {
    return this.httpClient.get<RestfulOutCompanyDetailsData>(RentalApiLibrary.rentalCompanyDetail + `/${params.companyId}`);
  }

  //  Car rental information list query
  carRentalVehiclesSearch(params: InCarRentalInfoListSearch): Observable<RestfulOutCarRentalInfoList> {
    const p = new HttpParams({ fromObject: params as unknown as GetParams });
    return this.httpClient.get<RestfulOutCarRentalInfoList>(RentalApiLibrary.carRentalVehiclesSearch, { params: p });
  }

  //   Car rental record information query
  carRentalTransactions(params: InCarRentalTransactions): Observable<RestfulOutCarRentalTransactions> {
    const p = new HttpParams({ fromObject: params as unknown as GetParams });
    return this.httpClient.get<RestfulOutCarRentalTransactions>(RentalApiLibrary.carRentalTransactions, { params: p });
  }

  //  query camera management list
  cameraListSearch(params: InCameraSearch): Observable<RestfulOutCameraSearch> {
    return this.httpClient.post<RestfulOutCameraSearch>(CameraApiLibrary.cameraListSearch, params);
  }

  //  algorithms search
  algorithmsListSearch(): Observable<RestfulOutAlgorithmsListSearch> {
    return this.httpClient.get<RestfulOutAlgorithmsListSearch>(AiApiLibrary.algorithmsListSearch);
  }

  //  query watch list task
  watchlistTaskSearch(params: InWatchListTaskSearch): Observable<RestfulOutWatchListTaskSearch> {
    const copyParams = JSON.parse(JSON.stringify(params));
    if (copyParams.pageNo * copyParams.pageSize > 10000) {
      copyParams.pageSize = 10000 - (copyParams.pageNo - 1) * copyParams.pageSize;
    }
    return this.httpClient.post<RestfulOutWatchListTaskSearch>(AiApiLibrary.watchlistTaskSearch, copyParams);
  }

  //  create watchlist task save
  watchListTaskSave(params: InWatchListTaskSave): Observable<Restful> {
    return this.httpClient.post<Restful>(AiApiLibrary.watchListTaskSave, params);
  }

  //  create whitelist task save
  whiteListTaskSaveAdd(params: InWhitelistTaskSave): Observable<RestfulOutWhitelistTaskSaveUpdate> {
    return this.httpClient.post<RestfulOutWhitelistTaskSaveUpdate>(AiApiLibrary.whitelistTaskSave, params);
  }

  //  Update whitelist task save
  whiteListTaskSaveUpdate(params: InWhitelistTaskSave): Observable<RestfulOutWhitelistTaskSaveUpdate> {
    return this.httpClient.put<RestfulOutWhitelistTaskSaveUpdate>(AiApiLibrary.whitelistTaskSave, params);
  }

  //  query white list task
  whitelistTaskSearch(params: InWhiteListTaskSearch): Observable<RestfulWhitelistTaskSearch> {
    const copyParams = JSON.parse(JSON.stringify(params));
    if (copyParams.pageNo * copyParams.pageSize > 10000) {
      copyParams.pageSize = 10000 - (copyParams.pageNo - 1) * copyParams.pageSize;
    }
    const p = new HttpParams({ fromObject: copyParams as unknown as GetParams });
    return this.httpClient.get<RestfulWhitelistTaskSearch>(AiApiLibrary.whitelistTaskSearch, { params: p });
  }

  //  Delete watchlist task
  watchlistTaskDelete(params: InAlgorithmsListSearch): Observable<Restful> {
    return this.httpClient.post<Restful>(AiApiLibrary.watchlistTaskDelete, params);
  }

  //  watch List Task Enable
  watchListTaskEnable(params: InAlgorithmsListSearch): Observable<Restful> {
    return this.httpClient.post<Restful>(AiApiLibrary.watchListTaskEnable, params);
  }

  //  watch List Task Disable
  watchListTaskDisable(params: InAlgorithmsListSearch): Observable<Restful> {
    return this.httpClient.post<Restful>(AiApiLibrary.watchListTaskDisable, params);
  }

  //  Searc Device
  watchlistTaskSearcDevice(id: string): Observable<RestfulOutWatchSearcDevice> {
    return this.httpClient.post<RestfulOutWatchSearcDevice>(AiApiLibrary.watchlistTaskSearcDevice, { id });
  }

  //  Delete whitelist task
  whitelistTaskDelete(params: InAlgorithmsListSearch): Observable<Restful> {
    return this.httpClient.delete<Restful>(AiApiLibrary.whitelistTaskDelete + `/${params.id}`);
  }

  // query behavior task
  behavioralTaskSearch(params: InBehavioralTaskSearch): Observable<RestfulOutBehavioralTaskSearch> {
    return this.httpClient.post<RestfulOutBehavioralTaskSearch>(AiApiLibrary.behavioralTaskSearch, params);
  }

  behavioralTaskSave(params: InWatchListTaskSave): Observable<Restful> {
    return this.httpClient.post<Restful>(AiApiLibrary.behavioralTaskSave, params);
  }

  behavioralAlgorithmInfo(params: string): Observable<AlgorithmOutputData> {
    return this.httpClient.get<AlgorithmOutputData>(AiApiLibrary.behavioralAlgorithmInfo + `/${params}`);
  }

  getAllDeviceData(): Observable<OutAllDeviceData> {
    return this.httpClient.get<OutAllDeviceData>(AiApiLibrary.getAllDeviceData);
  }

  behavioralTaskDelete(params: InBehavioralTaskDelete): Observable<Restful> {
    return this.httpClient.post<Restful>(AiApiLibrary.behavioralTaskDelete, params);
  }

  geofenceListTaskSearch(params: InGeofenceTaskSearch): Observable<RestfulOutGeoFenceTaskSearch> {
    const copyParams = JSON.parse(JSON.stringify(params));
    if (copyParams.pageNo * copyParams.pageSize > 10000) {
      copyParams.pageSize = 10000 - (copyParams.pageNo - 1) * copyParams.pageSize;
    }
    return this.httpClient.post<RestfulOutGeoFenceTaskSearch>(AiApiLibrary.geofenceListTaskSearch, copyParams);
  }

  geofenceListTaskDelete(params: InAlgorithmsListSearch): Observable<Restful> {
    return this.httpClient.post<Restful>(AiApiLibrary.geofenceListTaskDelete, params);
  }

  geofenceListTaskSave(params: InWatchListTaskSave): Observable<Restful> {
    return this.httpClient.post<Restful>(AiApiLibrary.geofenceListTaskSave, params);
  }

  geofenceListTaskEnable(params: InAlgorithmsListSearch): Observable<Restful> {
    return this.httpClient.post<Restful>(AiApiLibrary.geofenceListTaskEnable, params);
  }

  geofenceTaskDetail(params: InGeofenceTaskDetail): Observable<RestfulOutGeofenceTaskDetail> {
    const p = new HttpParams({ fromObject: params as unknown as GetParams });
    return this.httpClient.get<RestfulOutGeofenceTaskDetail>(AiApiLibrary.geofenceTaskDetail, { params: p });
  }

  // query white list Task Detail
  whitelistTaskDetail(params: InWhitelistTaskDetail): Observable<RestfulOutWhitelistTaskDetail> {
    const p = new HttpParams({ fromObject: params as unknown as GetParams });
    return this.httpClient.get<RestfulOutWhitelistTaskDetail>(AiApiLibrary.whitelistTaskDetail, { params: p });
  }

  // query gpu lpr task
  gpuLprTaskSearch(params: InGpuLprTaskSearch): Observable<RestfulOutGpuLprTaskSearch> {
    return this.httpClient.post<RestfulOutGpuLprTaskSearch>(AiApiLibrary.gpuLprTaskSearch, params);
  }

  // query Camera list
  gpuLprTaskCameraQuery(): Observable<RestfulOutGpuLprCameraList> {
    return this.httpClient.get<RestfulOutGpuLprCameraList>(AiApiLibrary.gpuLprTaskCameraQuery);
  }

  // Delete gpuLpr Task
  gpuLprTaskDelete(params: InAlgorithmsListSearch): Observable<Restful> {
    return this.httpClient.post<Restful>(AiApiLibrary.gpuLprTaskDelete, params);
  }

  // create or update gpuLpr Task
  gpuLprTaskSave(params: InGpuLprTaskSave): Observable<Restful> {
    return this.httpClient.post<Restful>(AiApiLibrary.gpuLprTaskSave, params);
  }

  // start Task
  gpuLprTaskStart(params: InAlgorithmsListSearch): Observable<Restful> {
    return this.httpClient.post<Restful>(AiApiLibrary.gpuLprTaskStart, params);
  }

  // stop Task
  gpuLprTaskStop(params: InAlgorithmsListSearch): Observable<Restful> {
    return this.httpClient.post<Restful>(AiApiLibrary.gpuLprTaskStop, params);
  }

  //  Device update
  cameraUpdate(params: CameraInfo): Observable<Restful> {
    return this.httpClient.post<Restful>(CameraApiLibrary.cameraUpdate, params);
  }

  //  Device Delete
  cameraDelete(params: InCameraDelete): Observable<Restful> {
    return this.httpClient.post<Restful>(CameraApiLibrary.cameraDelete, params);
  }
}
