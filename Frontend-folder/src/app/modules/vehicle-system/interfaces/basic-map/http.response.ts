export interface SiteData {
  siteType: string,
  latitude: string,
  longitude: string,
  siteCameraNum: string,
  siteName: string,
  siteCode: string,
  lprCameraNum: string,
  totalTask: string,
}
export interface QuerySitesRes {
  status: number,
  result: Array<SiteData>
}


export interface CameraData {
  cameraName: string,
  cameraCode: string,
  cameraId: string,
  cameraType: string,
  latitude: string,
  longitude: string,
  siteName?: string,
}
export interface QueryCamerasRes {
  status: number,
  result: Array<CameraData>
}


export interface AlertsData {
  longitude?: string,
  alertType?: string,
  cameraCode?: string,
  alertId?: string,
  latitude?: string,
  cameraId?: string,
  siteName?: string,
  siteCode?: string,
  totalAlert?: number,
  watchListAlert: number,
  behavioralAlert: number,
  geofenceAlert: number,
}
export interface AllAlertsSearchRes {
  status: number,
  result: Array<AlertsData>
}


export interface LatestAlert {
  captureImageUrl: string,
  captureDate: string,
  captureTime: string,
  vehicleMake: string,
  plateColor: string,
  vehicleSpeed: string,
  vehicleColor: string,
  vehicleType: string,
  vehicleModel: string,
  vehicleImage: string,
  country: string,
  alertId: string,
  id: string,
  plateImageUrl: string,
  alertType: string,
  plateImage: string,
  behaviorAlertType?: string,
  time?: string,
  speed?: string,
  isVideoExist?: string,
  leftTopX: number,
  leftTopY: number,
  rightBtmX: number,
  rightBtmY: number,
}
export interface LatestAlertRes {
  code: string;
  message: string;
  status: number,
  result: LatestAlert
}

export interface CameraInfo {
  cameraName: string,
  cameraId: string,
  cameraCode: string,
  cameraStatus: string,
  latitude: string,
  siteName: string,
  longitude: string,
  cameraType: string,
  cameraSource: string,
  laneId: string,
  laneNo: string,
  deviceType: string,
  id?: string;
  site?: string;
  ipv4?: string;
  streamURL?: string;
  isGpuAnalysis?: string;
}
export interface CameraInfoRes {
  message: string;
  code: string;
  status: number,
  result: CameraInfo
}

export interface HistoryStreamRes {
  message: string;
  code: string;
  status: number,
  result: string
}

export interface LatestCapture {
  captureDate: string,
  captureTime: string,
  vehicleMake: string,
  plateColor: string,
  vehicleSpeed: string,
  vehicleColor: string,
  country: string,
  vehicleType: string,
  vehicleModel: string,
  captureImageUrl: string,
  plateImageUrl: string,
  alertId: string;
}
export interface LatestCaptureRes {
  status: number,
  result: LatestCapture
}
