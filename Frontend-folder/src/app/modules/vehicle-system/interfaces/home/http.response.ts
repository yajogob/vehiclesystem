export interface GetVehicleCountRes {
  status: number,
  result: {
    vehicleCount: number
  }
}

export interface AlertCounts {
  watchListAlerts: string,
  behavioralAlerts: string,
  geofenceAlerts: string
}
export interface GetAlertCountsRes {
  status: number,
  result: AlertCounts
}

export interface TrafficSites {
  hotels: number,
  malls: number,
  gantry: number,
  streetCameras: number,
  total: number,
  totalCamera: number,
}
export interface StatisticsTrafficSitesRes {
  status: number,
  result: TrafficSites
}

export interface LiveTrafficData {
  currentTime: string,
  vehicleCaptureCount: number
}
export interface StatisticsLiveTrafficRes {
  status: number,
  result: Array<LiveTrafficData>
}

export interface BehavioralAlertData {
  name: string,
  count: number,
  code: string
}
export interface BehavioralAlertsStatisticsRes {
  status: number,
  result: Array<BehavioralAlertData>
}

export interface BehavioralAlertLineData {
  majorCount: number,
  minorCount: number,
  currntTime: string,
  criticalCount: number,
  currentTimeDate: number
}
export interface BehavioralAlertsStatisticsByTimeRes {
  status: number,
  result: Array<BehavioralAlertLineData>
}

export interface TopAlarm {
  warningTime: string | number;
  warningName: string;
  id: string;
  cameraName?: string;
  plateNumber?: string;
  plateNo?: string;
  deviceName?: string;
  algorithmName?: string;
  alertType?: string;
}
export interface HomePageTopAlertRes {
  status: number,
  result: {
    content: Array<TopAlarm>
  }
}
