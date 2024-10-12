import { SiteTreeNode } from '../../components/site-selector/interfaces/http.response';

export interface WatchlistAlertsParams {
  region: null | string,
  sites: Array<SiteTreeNode>,
  plateCategory: null | string,
  plateNo: null | number,
  plateColor: null | string,
  startDateTime: null | number,
  endDateTime: null | number,
  taskLevel: null | string,
  pageNo: number,
  pageSize: number,
  exactNum: string
}

export interface BehavioralAlertsParams {
  location: null | string,
  alertType: null | string,
  taskName: null | string,
  startDateTime: null | number,
  taskLevel: null | string,
  endDateTime: null | number,
  priority: null | string,
  sites: Array<SiteTreeNode>,
  pageNo: number,
  pageSize: number,
}

export interface GeofenceAlertsParams {
  taskName: null | string,
  startDateTime: null | number,
  endDateTime: null | number,
  taskLevel: null | string,
  pageNo: number,
  pageSize: number,
  sites: Array<SiteTreeNode>,
}

export interface CreateTaskParams {
  taskType?: null | string,
  id?: null | string,
  deviceIds?: Array<string>,
  region?: null | string,
  plateNumber?: null | string,
  plateCategory?: null | string,
  plateColor?: null | string,
  startDateTime?: null | number,
  endDateTime?: null | number,
  description?: null | string,
  taskName?: null | string,
  algorithm?: null | string,
  taskLevel?: null | string,
  timeCycle?: null | string,
  devices?: null | string,
  imageFile?: object,
  controlType?: null | string,
  trafficThresholdEnabke?: boolean,
  trafficThresholdValue?: number,
  siteScope?: null | string,
  site?: null | string,
  alarmRecipient?: null | string
}

export class InNoNumberPlate {
  dir?: string;
  startDateTime!: number | null;
  endDateTime!: number | null;
  pageNo!: number;
  pageSize!: number;
  sites!: Array<SiteTreeNode>;
}

export class OutNoNumberPlateListObservable {
  code!:  string;
  status!: number;
  result!: OutNoNumberPlateContent;
}

class OutNoNumberPlateContent {
  content!: Array<OutNoNumberPlateList>;
  totalElements!: number;
}

export class OutNoNumberPlateList {
  id!: string;
  vehicleModel!: string;
  vehicleMake!: string;
  vehicleModelDesc!: string | undefined;
  vehicleMakeDesc!: string | undefined;
  vehicleImage!: string;
  vehicleColor!: string;
  vehicleColorDesc!: string | undefined;
  speed!: number;
  siteName!: string;
  region!: string;
  regionShort!: string;
  plateNumber!: string;
  plateImage!: string;
  plateColor!: string;
  motorVehicleID!: string;
  longitude!: string;
  latitude!: string;
  category!: string;
  captureDate!: string;
  cameraId!: string;
  captureTime!: number;
  cameraName!: string;
  taskName?: string;
  warningName?: string;
  priority?: string;
  priorityValue?: string;
  plateNo?: string;
  alertId?: string;
}
