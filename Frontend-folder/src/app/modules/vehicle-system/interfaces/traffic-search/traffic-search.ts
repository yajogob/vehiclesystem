import { SiteTreeNode } from '../../components/site-selector/interfaces/http.response';
import { CodesArrayItem } from '../key-value-type';

export class TrafficSearchListParams {
  dir!: string;
  endDateTime!: number | null;
  pageNo!: number;
  pageSize!: number;
  plateCategory!: string;
  exactNum!: number | null;
  plateColor!: string;
  plateNumber!: string;
  region!: string;
  sites!: string[] | SiteTreeNode[];
  startDateTime!: number | null;
  vehicleColor!: string;
  vehicleMake!: string;
  vehicleModel!: string;
}

export class TrafficSearchListResponse {
  message!: string;
  result!: TrafficSearchList;
}

export class TrafficSearchList {
  last!: boolean;
  content!: TrafficSearchItem[];
  numberOfElements!: number;
  first!: boolean;
  number!: number;
  totalPages!: number;
  totalElements!: number;
  size!: number;
}

export class TrafficSearchItem {
  region!: string;
  captureTime!: string;
  plateImage!: string;
  category?: string;
  plateCategory?: string;
  plateNumber!: string;
  plateColor!: string | undefined | null | string[];
  plateColorList?: string[];
  plateColorDesc?: string | undefined | null;
  vehicleMake!: string | undefined | null;
  vehicleColor!: string | undefined | null;
  vehicleColorDesc?: string | undefined | null;
  speed!: number;
  siteName!: string;
  cameraName!: string;
  vehicleModel!: string | undefined | null;
  endDateTime!: number;
  startDateTime!: number;
  [key: string]: boolean | string | number | string[] | undefined | null;
}

export class TrafficSearchTableConditionsChange {
  type!: string;
  data!: string | number;
}

export class GetTrafficSearchListParams {
  type!: string;
  data!: string | number | TrafficSearchListParams;
}

export type CodeItemType = (props: Array<CodesArrayItem>) => void;

export interface codeItemMapType {
  'LprRegion'?: CodeItemType;
  'LprCategory'?: CodeItemType;
  'LprPlateColor'?: CodeItemType;
  'LprVehicleColor'?: CodeItemType;
  'LprVehicleBrandType'?: CodeItemType;
  'LprExactNum'?: CodeItemType;
  'Lpr_G42_PLATE_COLORS'?: CodeItemType;
  'Lpr_G42_VEHICLE_TYPES'?: CodeItemType;
}

export interface VehicleMakeKeyValueType {
  key: string;
  value: string | number;
}
