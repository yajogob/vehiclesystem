import { SiteTreeNode } from "../../components/site-selector/interfaces/http.response";
import { CodesArrayItem } from '../key-value-type';

export class sitesType {
  checked!: boolean;
  code!: string;
  codeDesc!: string;
  district!: string;
  level!: number;
  path!: Array<{code: string, codeDesc: string}>;
}

class PageInfo {
  pageNo!: number;
  pageSize!: number;
  total!: number;
  totalPages!: number;
}

export class InAlgorithmsListSearch {
  id?: string;
  taskId?: number;
}

export class OutAlgorithmsListSearch {
  name?: string;
  enName?: string;
  arName?: string;
  id?: string;
  description?: string;
  enDescription?: string;
  arDescription?: string;
  assignedTaskNumber?: string | number;
  rotate?: string | number;
  angle?: string | number;
  top?: string;
  left?: string;
  right?: string;
  algorithm?: string;
  videoUrl?: string;
  isMore?: boolean;
}

export class RestfulOutAlgorithmsListSearch {
  code!: string;
  status!: number;
  result!: Array<OutAlgorithmsListSearch>;
}

export class PromiseOutAlgorithmsListSearch {
  leftData!: OutAlgorithmsListSearchResult;
  rightData!: OutAlgorithmsListSearchResult;
  data!: OutAlgorithmsListSearchResult;
}

class OutAlgorithmsListSearchResult {
  result!: Array<OutAlgorithmsListSearch>;
}

export class AiListParentSplit {
  leftList!: Array<OutAlgorithmsListSearch>;
  rightList!: Array<OutAlgorithmsListSearch>;
}

export class AiListChildSplit {
  top!: Array<OutAlgorithmsListSearch>;
  mid!: Array<OutAlgorithmsListSearch>;
  bottom!: Array<OutAlgorithmsListSearch>;
}

export class InWatchListTaskSearch {
  plateColor!: string;
  plateNumber!: string;
  plateCategory!: string;
  region!: string;
  regionShort!: string;
  endDateTime!: number;
  startDateTime!: number;
  priority!: string;
  endDate!: number;
  startDate!: number;
  pageNo!: number;
  pageSize!: number;
}

export class PromiseOutWatchListTaskSearch {
  number!: number;
  totalPages!: string | number;
  totalElements!: number;
  size!: number;
  numberOfElements!: number;
  last!: boolean;
  first!: boolean;
  content!: Array<OutWatchListTaskSearch>;
}

export class RestfulOutWatchListTaskSearch {
  code!: string;
  status!: number;
  result!: PromiseOutWatchListTaskSearch;
}

export class OutWatchListTaskSearch {
  entryPeriod!: string;
  plateNumber!: string;
  startDateTime!: string;
  endDateTime!: string;
  effectiveType!: string;
  currentStatus!: string | boolean;
  plateColor!: string;
  remark!: string;
  entryPerson!: string;
  id!: string;
  taskLevel!: string;
  deviceList!: Array<{deviceName: string, deviceId: string}>;
  region!: string;
  regionShort!: string;
  plateCategory!: string;
}

export class InWhiteListTaskSearch {
  plateColor!: string;
  endDate!: string | number;
  startDate!: string | number;
  region!: string;
  regionShort!: string;
  plateCategory!: string;
  plateNumber!: string;
  pageNo!: number;
  pageSize!: number;
}

export class OutWhiteListTaskSearch {
  plateColor!: string;
  plateCategory!: string;
  plateNumber!: string;
  currentStatus!: string;
  taskType!: string;
  taskId!: string;
  description!: string;
  endDate!: string;
  region!: string;
  regionShort!: string;
  startDate!: string;
}

export class WatchAndWhiteCreateTask {
  plateColor?: string;
  plateCategory?: string;
  plateNumber?: string;
  taskType?: string;
  taskId?: string;
  description?: string;
  endDate?: string;
  region?: string;
  regionShort?: string;
  startDate?: string;
  entryPeriod?: string;
  startDateTime?: string;
  endDateTime?: string;
  effectiveType?: string;
  currentStatus?: string | boolean;
  remark?: string;
  entryPerson?: string;
  trafficThresholdEnable?: number;
  id?: string;
  algorithm?: string;
  taskLevel?: string;
  taskName?: string;
  trafficThresholdNumber?: string;
  deviceList?: Array<{deviceName: string, deviceId: string}>;
  sites!: Array<SiteTreeNode>;
  startDateTimestamp?: number;
  endDateTimestamp?: number;
}

export class PromiseOutWhiteListTaskSearch extends PageInfo {
  data!: Array<OutWhiteListTaskSearch>;
}

export class RestfulWhitelistTaskSearch {
  code!: string;
  result!: PromiseOutWhiteListTaskSearch;
  status!: number;
}

export class RestfulOutBehavioralTaskSearch {
  code!: string;
  status!: number;
  result!: PromiseOutBehavioralTaskSearch;
}

export class AlgorithmOutputData {
  code!: string;
  result!: Array<string>;
  status!: number;
}

export class OutAllDeviceData {
  code!: string;
  result!: SiteTreeNode;
  status!: number;
}

export class RestfulOutGeoFenceTaskSearch {
  code!: string;
  status!: number;
  result!: PromiseOutGeoFenceTaskSearch;
}

export class RestfulOutGeofenceTaskDetail {
  code!: string;
  status!: number;
  result!: PromiseOutGeofenceTaskDetail;
}

export class PromiseOutGeofenceTaskDetail {
  taskName!: string;
  startDateTime!: number;
  endDateTime!: number;
  taskLevel!: string;
  taskStatus!: number;
  trafficThresholdEnable!: number;
  trafficThresholdNumber!: number;
  cameraList!: Array<{cameraName: string, cameraId: string}>;
  description!: string;
  taskId!:number;
}

export class InBehavioralTaskSearch {
  taskName!: string;
  startTime!: number;
  endTime!: number;
  pageNo!: number | string;
  pageSize!: number | string;
  startDateTime!: number | string;
  endDateTime!: number | string;
}

export class InBehavioralListTaskSave{
  id?: string;
  taskName?: string;
  eventLevel!: string;
  description?: string;
  startDate?: string | number;
  endDate?: string | number;
  taskId?: string;
  taskType?: string;
  sitesCodeList?: string[];
  sites!: Array<sitesType>;
}

export class InBehavioralTaskSave {
  id?: string;
  taskName?: string;
  eventLevel!: string;
  description?: string;
  startDate?: string | number;
  endDate?: string | number;
  taskId?: string;
  taskType?: string;
  sitesCodeList?: string[];
  sites!: Array<sitesType>;
}

export class PromiseOutBehavioralTaskSearch extends PageInfo {
  content!: Array<OutBehavioralTaskSearch>;
  totalElements!: number;
}

export class OutBehavioralTaskSearch {
  taskName!: string;
  algorithmsType!: string;
  computingCapability!: string;
  taskLevel!: string;
  eventLevel!: string;
  timeCycle!: string;
  device!: string;
  alertResults!: string;
  taskStatus!: string;
  taskId!: string;
  algoPackageId!: string;
  id!: string;
  enabled?: boolean;
  sites!: Array<sitesType>;
}

export class PromiseOutBehavioralTaskDetail {
  taskId!: string;
  taskName!: string;
  algoTaskType!: string;
  taskLevel!: string;
  enabled!: boolean;
  taskCycle!: string;
  description!: string;
  deviceInfo!: Array<{deviceId: string, deviceName: string, sceneImageUrl: string}>;
  algoPackageId!: string;
  taskCategoryName!: string;
  playback!: string;
  eventTypeId!: string;
}

export class InWatchListTaskSave {
  plateCategory?: string;
  plateColor?: string;
  startDateTime?: string;
  endDateTime?: string;
  description?: string;
  plateNumber?: string;
  id?: string;
  region?: string;
  regionShort?: string;
  dateRangeStart?: string;
  dateRangeEnd?: string;
  taskType?: string;
  startDate?: string | number;
  endDate?: string | number;
  camera?: string[];
  sitesCodeList?: string[];
  sites!: Array<sitesType>;
}

export class RestfulOutWatchSearcDevice {
  code!: string;
  status!: number;
  result!: ObOutWatchSearcDevice;
}

export class ObOutWatchSearcDevice {
  id!: string;
  plateColor!: string;
  deviceList!: Array<{deviceId: string, deviceName: string}>;
  plateNumber!: string;
  region!: string;
  regionShort!: string;
  remark!: string;
  startDateTime!: string;
  taskLevel!: string;
  plateCategory!: string;
  currentStatus!: string;
  endDateTime!: string;
}

export class InWhitelistTaskSave{
  id?: string;
  plateCategory?: string;
  plateColor?: string;
  plateNumber?: string;
  region?: string;
  regionShort?: string;
  dateRangeStart?: string;
  dateRangeEnd?: string;
  taskType?: string;
  description?: string;
  startDate?: string | number;
  endDate?: string | number;
  taskId?: string;
}
export class RestfulOutWhitelistTaskSaveUpdate {
  code!: string;
  result!: OutWhiteListTaskSearch;
  status!: number;
}

export class PromiseOutGeoFenceTaskSearch extends PageInfo {
  content!: Array<OutGeofenceTaskSearch>;
  totalElements!: number;
}

export class InGeofenceTaskSearch {
  taskName!: string;
  startDateTime!: number | string;
  endDateTime!: number | string;
  pageNo!: number;
  pageSize!: number;
}

export class InBehavioralTaskDelete {
  taskId!: string;
}

export class OutGeofenceTaskSearch {
  taskName!: string;
  taskCycle!: string;
  taskLevel!: string;
  taskStatus!: number | boolean;
  startDateTime!: number | string;
  endDateTime!: number | string;
  taskId!: number;
}

export class InGeofenceListTaskSave{
  id?: string;
  taskName?: string;
  eventLevel!: string;
  trafficThresholdEnable!: number;
  trafficThresholdNumber!: number;
  description?: string;
  startDate?: string | number;
  endDate?: string | number;
  taskId?: string;
  taskType?: string;
  sitesCodeList?: string[];
  sites!: Array<sitesType>;
}

export class InGeofenceTaskDetail {
  taskId!: number;
}

export class OutGeofenceListTaskSearch {
  plateColor!: string;
  plateCategory!: string;
  plateNumber!: string;
  currentStatus!: string;
  taskType!: string;
  taskId!: string;
  description!: string;
  endDate!: string;
  region!: string;
  regionShort!: string;
  startDate!: string;
}

export class InWhitelistTaskDetail extends PageInfo {
  taskId!: string;
  type!: string;
}

export class OutWhitelistTaskDetail {
  alertDate!: string;
  alertType!: string;
  cameraName!: string;
  imageFileUrl!: string;
  plateNumber!: string;
  taskId!: string;
  alertTime!: string;
  alertIcon!: string;
  alertDateTime!: number;
}

export class PromiseOutWhitelistTaskDetail extends PageInfo {
  data!: Array<OutWhitelistTaskDetail>;
}

export class RestfulOutWhitelistTaskDetail {
  code!: string;
  status!: number;
  result!: PromiseOutWhitelistTaskDetail;
}

export class InGpuLprTaskSearch {
  taskName!: string;
  taskType!: string;
  startDateTime!: string | number;
  endDateTime!: string | number;
  pageNo!: number;
  pageSize!: number;
}

export class OutGpuLprTaskSearch {
  creator!: string;
  taskId!: string;
  parsingTargetQuality!: string;
  createTime!: string;
  cameraQuality!: string | number;
  taskName!: string;
  taskStatus!: string;
  deviceList!: Array<{deviceName: string, deviceId: string}>;
  sites!: Array<SiteTreeNode>;
}

export class RestfulOutGpuLprTaskSearch {
  code!: string;
  status!: number;
  result!: PromiseOutGpuLprTaskSearch;
}

export class PromiseOutGpuLprTaskSearch {
  last!: boolean;
  number!: number;
  totalElements!: number;
  size!: number;
  numberOfElements!: number;
  first!: boolean;
  totalPages!: string | number;
  content!: Array<OutGpuLprTaskSearch>;
}

export class OutGpuLprCameraList {
  deviceId!: string;
  deviceName!: string;
}

export class GpuLprSitesKeyValue {
  code!: string;
  codeDesc!: string;
}

export class PromiseOutGpuLprCameraList {
  content!: Array<OutGpuLprCameraList>;
}

export class RestfulOutGpuLprCameraList {
  code!: string;
  status!: number;
  result!: PromiseOutGpuLprCameraList;
}

export class InGpuLprTaskSave {
  id!: string;
  taskName!: string;
  selectedCameras!: {deviceName: string, deviceId: string}[];
  sites!: Array<SiteTreeNode>;
}

export class Restful {
  code?: string;
  status?: number;
  message?: string;
}

export type FcType = (props: Array<CodesArrayItem>) => void;
export interface FcMapType {
  'LprRegion'?: FcType;
  'LprCategory'?: FcType;
  'LprPlateColor'?: FcType;
  'LprTaskLevel'?: FcType;
  'LprWatchListStatus'?: FcType;
  'LprAlertType'?: FcType;
  'LprFineType'?: FcType;
  'LprExactNum'?: FcType;
  'Lpr_G42_PLATE_COLORS'?: FcType;
  'Lpr_G42_VEHICLE_TYPES'?: FcType;
  'LprVehicleColor'?: FcType;
  'LprVehicleBrandType'?: FcType;
  'Lpr_G42_PLATE_REGIONS'?: FcType;
  'Lpr_G42_PLATE_CATEGORY_ALL'?: FcType;
}
