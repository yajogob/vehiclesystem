import { CodesArrayItem } from '../key-value-type';

export class GetFakePlateSearchParams {
  isNoDataBase?: string;
  type!: string;
  data!: string | number | FakePlateSearchParams;
}

export class FakePlateSearchParams {
  endDateTime!: number;
  informationStatus!: string | null;
  pageNo!: number;
  pageSize!: number;
  plateCategory!: string | null;
  exactNum!: number | null;
  plateColor!: string | null;
  plateNumber!: string;
  region!: string | null;
  sites!: string[];
  selectSearchType!: string | null;
  startDateTime!: number;
}

export class OutFakePlateSearch {
  currentStatus!: string;
  lastRecordTime!: string;
  plateNumber!: string;
  searchType!: string;
}

class lastVehicle {
  vehicleImage!: string;
  plateNumber!: string;
  vehicleMake!: string;
  vehicleModel!: string;
  captureDateTime!: number;
  cameraName!: string;
  region!: string;
  plateType!: string;
}

export class LayerInfoResponse {
  cameraName!: string;
  captureDateTime!: number;
  currentStatus!: string;
  enteryPerson!: string;
  id!: string;
  lastRecordTime!: number;
  lastVehicle!: lastVehicle;
  model!: string;
  owner!: string;
  plateColor!: string;
  plateNumber!: string;
  searchType!: string;
  vehicleImage!: string;
  vehicleMake!: string;
  vehicleModel!: string;
  vehicleYear!: string;
  region!: string;
  plateType!: string;
}

export class FakePlateSearchResponse {
  result!: {
    number: number;
    content: FakePlateSearchItem[];
    numberOfElements: number;
    last: boolean;
    first: boolean;
    size: number;
    totalPages: number;
    totalElements: number;
  };
}

export class FakePlateSearchItem {
  lastVehicle!: {
    vehicleImage: string;
    vehicleMake: string;
    plateNumber: string;
    captureDateTime: string;
    cameraName: string;
    vehicleModel: string;
  };

  region!: string;
  plateType!: string;
  vehicleImage!: string;
  vehicleMake!: string;
  cameraName!: string;
  vehicleModel!: string;
  plateColor!: string | null | undefined;
  owner!: string;
  vehicleYear!: string;
  captureDateTime!: string;
  id!: string;
  enteryPerson!: string;
  plateNumber!: string;
  lastRecordTime!: string;
  searchType!: string | null | undefined;
  currentStatus!: string | null | undefined;
}

export class checkFakePlateParams {
  id!: string;
  informationStatus!: string;
}

export class checkFakePlateResponse {
  result!: boolean;
}

export type CodeItemType = (props: Array<CodesArrayItem>) => void;

export interface codeItemMapType {
  'LprRegion'?: CodeItemType;
  'LprCategory'?: CodeItemType;
  'LprPlateColor'?: CodeItemType;
  'LprFakeInformationStatus'?: CodeItemType;
  'LprFakeSearchType'?: CodeItemType;
  'LprVehicleBrandType'?: CodeItemType;
  'LprExactNum'?: CodeItemType;
  'LprFakePlateCheck'?: CodeItemType;
}

export class fakePlateTableConditionsChange {
  isNoDataBase?: string;
  type!: string;
  data!: string | number;
}

export interface KeyValueString {
  key: string,
  value: string,
}

export class InTrafficCheckPlate {
  region!: string;
  plateCategory!: string;
  plateNumber!: string;
  exactNum!: string;
  plateColor!: string;
  startDateTime!: number;
  endDateTime!: number;
}

export class OutTrafficCheckPlate {
  code!: string;
  result!: Array<OutTrafficCheckPlateResult>;
  message!: string;
}

export class OutTrafficCheckPlateResult {
  plateCategory!: string;
  plateNumber!: string;
  region!: string;
  checkResult!: string | number;
}
