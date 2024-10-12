
export interface WatchlistAlert {
  time: string,
  priority: string,
  priorityValue: string,
  latitude: string,
  plateNo: string,
  plateMake: string,
  plateModel: string,
  longitude: string,
  cameraId: string,
  CameraName: string,
  alertId: string,
  camera: string,
  id?: string,
  alertType?: string,
  region?: string,
  regionShort?: string,
  category?: string,
  plateNumber?: string,
  siteName?: string,
  taskName?: string,
  warningName?: string,
}
export interface WatchListAlertsSearchRes {
  status: number,
  result: {
    content: Array<WatchlistAlert>,
    totalElements: number
  }
}

export interface BehavioralAlert {
  alertId: string,
  CameraName: string,
  latitude: string,
  plateNumber: string,
  time: string,
  cameraId: string,
  longitude: string,
  priority: string,
  priorityValue: string,
  plateMake: string,
  plateModel: string,
  behaviorAlertType: string,
  camera: string,
  id?: string,
  alertType?: string,
  region?: string,
  regionShort?: string,
  category?: string,
  siteName?: string,
  taskName?: string,
  warningName?: string,
  plateNo: string,
}
export interface BehavioralAlertsSearchRes {
  status: number,
  result: {
    content: Array<BehavioralAlert>,
    totalElements: number
  }
}

export interface GeofenceAlert {
  time: string,
  camera: string,
  plateNumber: string | number,
  plateModel: string,
  plateMake: string,
  priority: string,
  priorityValue: string,
  longitude: string | number,
  cameraId: string,
  CameraName: string,
  latitude: string | number,
  id?: string,
  alertType?: string,
  alertId?: string,
  region?: string,
  regionShort?: string,
  category?: string,
  plateNo?: string,
  siteName?: string,
  taskName?: string,
  warningName?: string,
}
export interface GeofenceAlertsSearchRes {
  status: number,
  result: {
    content: Array<GeofenceAlert>,
    totalElements: number
  }
}

export interface CreateAlertTaskRes {
  status: number,
  result: string
}

export class CardViewTable {
  alertId?: string;
  cameraName?: string;
  latitude?: string | number;
  plateNumber?: string | number;
  time?: string;
  cameraId?: string;
  longitude?: string | number;
  priority?: string;
  plateMake?: string;
  plateModel?: string;
  behaviorAlertType?: string;
  camera?: string;
  id?: string;
  alertType?: string;
  plateImage?: string;
  priorityValue?: string;
  captureTime?: string | number;
  region?: string;
  regionShort?: string;
  category?: string;
  plateType?: string;
  plateNo?: string;
  siteName?: string;
  plateImageUrl?: string;
  vehicleModel?: string;
  vehicleMake?: string;
  vehicleMark?: string;
  vehicleImage?: string;
  trafficThresholdNumber?: number;
}
