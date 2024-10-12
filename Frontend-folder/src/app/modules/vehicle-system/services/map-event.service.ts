import { Coordinates } from "@interface/coordinates";
import { BehaviorSubject } from "rxjs";
import { OutNoNumberPlateList } from "../interfaces/alert/http.params";
import { BehavioralAlert, CardViewTable, GeofenceAlert, WatchlistAlert } from '../interfaces/alert/http.response';
import { AlertsData, CameraData, SiteData } from '../interfaces/basic-map/http.response';
import { VehicleProfileCountMap, VehicleProfileTimeLineResultValue } from '../interfaces/vehicle-profile/vehicle-profile';

export interface SearchDate {
  startDateTime: number | string,
  endDateTime: number | string
}

export interface PointType {
  type: string,
  latitude: number,
  longitude: number,
  captureTime: number
}

export interface MapEventData {
  eventType: string,
  data: {
    tableData?: WatchlistAlert | GeofenceAlert | BehavioralAlert | OutNoNumberPlateList | CardViewTable,
    type?: string,
    defaultZoom?: number;
    pointType?: string,
    alertType?: string,
    watchlistDetail?: WatchlistAlert,
    watchlistList?: Array<WatchlistAlert>,
    geofenceDetail?: GeofenceAlert,
    geofenceList?: Array<GeofenceAlert>,
    alertPosition?: string,
    searchDate?: SearchDate,
    pointsList?: Array<PointType>,
    siteLocations?: Array<SiteData>,
    cameraLocations?: Array<CameraData>,
    alertLocations?: Array<AlertsData>,
    vehicleProfileTrackers?: Array<VehicleProfileTimeLineResultValue>,
    vehicleProfileAppearance?: VehicleProfileCountMap,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    trafficFineLocation?: any,
    trafficFineViewType?: string,
    center?: Coordinates,
  }
}

export class MapService {
  subject: BehaviorSubject<MapEventData> = new BehaviorSubject<MapEventData>({eventType: '', data: {}});
}
