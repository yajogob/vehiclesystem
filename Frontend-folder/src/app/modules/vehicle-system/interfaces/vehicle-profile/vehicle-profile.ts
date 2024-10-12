import { SiteTreeNode } from '../../components/site-selector/interfaces/http.response';
import { CodesArrayItem } from '../key-value-type';

export class VehicleProfileListParams {
  region!: string;
  plateCategory!: string;
  exactNum!: number;
  plateNumber!: string;
  plateColor!: string;
  sites?: Array<SiteTreeNode>;
  startDateTime!: number;
  endDateTime!: number;
  pageNo!: number;
  pageSize!: number;
}

export class OutVehicleProfile {
  trafficFileNumber!: string;
  plateColor!: string;
  plateNumber!: string;
}

class InsuranceDetails {
  insuranceType!: string;
  insuranceDate!: string;
  insuranceExpiryDate!: string;
  insurancePolicyNo!: string;
}

class VehicleRegInfo {
  registrationDate!: string;
  registrationExpiryDate!: string;
  registrationRenewDate!: string;
}

class FinancialLoanInfo {
  code!: string;
  reference!: string;
}

/*class CaptureInfoTimeLine {
  captureDate!: string
  captureTime!: string
  deviceId!: string
  latitude!: string
  longitude!: string
  motorVehicleID!: string
  vehicleImage!: string
}*/

class VehicleMakeModel {
  certificateCode!: string;
  certificateDate!: string;
  certificateNumber!: number;
  vehicleYear!: number;
  vehicleNationality!: string;
  gearType!: string;
  engineNumber!: string;
  indentificationNo!: number;
  type!: string;
  kind!: string;
  model!: string;
  make!: string;
  seat!: number;
  door!: number;
  color!: string;
  year!: number;
}

// export class InVehicleProfileDetails {
//   plateNumber!: string
// }
//
// export class OutVehicleProfileDetails {
//   insuranceDetails!: InsuranceDetails
//   vehicleRegInfo!: VehicleRegInfo
//   financialLoanInfo!: FinancialLoanInfo
//   captureInfo!: CaptureInfoTimeLine[] | CaptureInfo[]
//   vehicleMakeModel!: VehicleMakeModel
//   vehicleRegAddr!: string
// }

export class VehicleProfileTimeLineParams {
  trafficSearchEnter?: boolean;
  plateNumber!: string;
  startDateTime!: number;
  endDateTime!: number;
  plateCategory!: string;
  sites?: Array<SiteTreeNode>;
}

export class OutVehicleProfileTimeLine {
  captureDate!: string;
  captureTime!: string;
  deviceId!: string;
  latitude!: string;
  longitude!: string;
  motorVehicleID!: string;
  vehicleImage!: string;
}

export class OutVehicleProfileContent {
  trafficFileNumber!: number;
  plateColor!: string;
  plateNumber!: string;
  insuranceDetails!: InsuranceDetails;
  vehicleRegInfo!: VehicleRegInfo;
  financialLoanInfo!: FinancialLoanInfo;
  captureInfo!: CaptureInfo[];
  vehicleMakeModel!: VehicleMakeModel;
  vehicleRegAddr!: string;
}

export class promiseOutVehicleProfile {
  content!: OutVehicleProfileContent[];
  totalPages?: number;
  totalElements!: number;
  size!: number;
  numberOfElements!: number;
  number!: number;
  first!: boolean;
  last!: boolean;
}

export class VehicleProfileTimeLineResponse {
  status!: number;
  result!: VehiclePlateRecordResult;
}

export class VehicleProfileTimeLineResult {
  time!: string;
  value!: VehicleProfileTimeLineResultValue[];
  open!: string;
}

export interface VehiclePlateRecordResult {
  [key: string]: VehicleProfileTimeLineResult[]
}

export interface VehicleProfileCountMap {
  [key:string]: {
    count: number;
    latitude: number | null;
    longitude: number | null;
    cameraType?: string;
  }
}

export class VehicleProfileTimeLineResultValue {
  captureDate!: string;
  captureTime!: string | number;
  captureTimeFormat?:string | number;
  deviceId!: string;
  category!: string;
  plateNumber!: string;
  region!: string;
  latitude!: number | null;
  longitude!: number | null;
  motorVehicleID!: string;
  vehicleImage!: string;
  siteName?: string;
  cameraType?: string;
  plateFullDetails?: string;
  deviceName?: string;
}

export class vehicleListResponse {
  vehicleMake!: string;
  plateNumber!: string;
  cameraName!: string;
  imageFile!: string;
  CaptureDateTime!: string;
}

/*export class VehicleProfileTimeLineResponse {
  plateMake!: string
  owner!: string
  plateNumber!: string
  plateModel!: string
  plateColor!: string
  vehicleYear!: string
  EnteryPerson!: string
  vehicleList!: vehicleListResponse[]
  fakePlateNumReason!: string
}*/

// interface LastVehicle {
//   vehicleImage: string;
//   vehicleMake: string;
//   plateNumber: string;
//   captureDateTime: string;
//   cameraName: string;
// }

export class VehicleProfileListResponse {
  result!: {
    content: VehicleProfile[];
    last: boolean;
    first: boolean;
    totalPages: string;
    totalElements: number;
    size: number;
    numberOfElements: number;
    number: number;
  };

  status?: number;
  code?: string;
}

export class VehicleProfile {
  vehicleRegInfo!: {
    registrationRenewDate: string;
    registrationExpiryDate: string;
    registrationDate: string;
  };

  vehicleMakeModel!: {
    certificateDate: string;
    indentificationNo: string;
    engineNumber: string;
    gearType: string;
    vehicleNationality: string;
    certificateNumber: string;
    certificateCode: string;
    type: string;
    kind: string;
    model: string;
    make: string;
    seat: string;
    door: string;
    color: string;
    year: string;
    vehicleYear: string;
  };

  captureInfo!: CaptureInfo[];
  financialLoanInfo!: {
    reference: string;
    code: string;
  };

  vehicleRegAddr!: string;
  insuranceDetails!: {
    insurancePolicyNo: string;
    insuranceExpiryDate: string;
    insuranceDate: string;
    insuranceType: string;
  };

  plateNumber!: string;
  plateColor!: string;
  trafficFileNumber!: number;
  vehicleRegisterTo!: string;
  plateCategory!: string;
  region!: string;
  vehicleOwnership!: string;
  rentalCompanyNameEnglish!: string;
  rentalCompanyNameArabic!: string;
  companyNumber!: string;
  companyNameEnglish!: string;
  companyNameArabic!: string;
  nameEnglish!: string;
  nameArabic!: string;
  channel!: string;
  plateFullDetails!: string;
  fullLicenseDetails!: string;
  carTypeAr!: string;
  carTypeEn!: string;
  carMakeAr!: string;
  carMakeEn!: string;
  carColorAr!: string;
  carColorEn!: string;
  carModelAr!: string;
  carModelEn!: string;
}

export class CaptureInfo {
  latitude!: string;
  longitude!: string;
  CaptureDate!: string;
  CaptureImage!: string;
  CaptureTime!: string;
  description!: string;
}

export type CodeItemType = (props: Array<CodesArrayItem>) => void;

export interface codeItemMapType {
  'LprRegion'?: CodeItemType;
  'LprCategory'?: CodeItemType;
  'LprPlateColor'?: CodeItemType;
  'LprVehicleColor'?: CodeItemType;
  'LprVehicleType'?: CodeItemType;
  'LprExactNum'?: CodeItemType;
  'Lpr_G42_PLATE_REGIONS'?: CodeItemType;
  'Lpr_G42_PLATE_COLORS'?: CodeItemType;
  'Lpr_G42_VEHICLE_TYPES'?: CodeItemType;
  'Lpr_G42_PLATE_CATEGORY_ALL'?: CodeItemType;
}

export class GetVehicleProfileListParams {
  trafficSearchEnter!: boolean;
  type!: string;
  data!: string | number | VehicleProfileListParams;
}

export class styleType {
  [key: string]: string | number
}

export class GotraFficFine {
  region?: string;
  plateCategory?: string;
  plateNumber?: string;
  plateColor?: string;
  startDateTime?: number;
  endDateTime?: number;
}
