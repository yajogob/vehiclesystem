class PageInfo {
  pageNo!: number;
  pageSize!: number;
  totalPages!: number;
  total!: number;
}
export class InTrafficFineSearch {
  fineType!: string;
  toDate!: string | number;
  fromDate!: string | number;
  pageSize?: number;
  pageNo?: number;
  plateCategory?: string;
  exactNum?: string;
  plateColor?: string;
  plateRegion?: string;
  plateNumber?: string;
  searchType?: string;
  location!: string;
}

export class sitesType {
  checked?: boolean;
  code!: string;
  codeDesc!: string;
  district?: string;
  level?: number;
  path?: Array<{code: string, codeDesc: string}>;
}

export class PromiseOutTrafficFineSearch extends PageInfo {
  data!: Array<OutTrafficFineSearch>;
}

export class RestfulOutTrafficFineSearch {
  message!: string;
  code!: string;
  status!: number;
  result!: PromiseOutTrafficFineSearch;
}

export class OutTrafficFineSearch {
  fineDate!: string;
  fineInfos!: Array<FineInfo>;
}

export class FineInfo {
  ticketTime!: string | number;
  driverLicense!: string;
  plateNumber!: string;
  fineType!: string;
  ticketLocation!: string;
  id!: string;
  ticketXco!: string;
  ticketYco!: string;
  emirates!: string;
  driversName!: string;
  ticketDate!: string | number;
  ticketYear!: string;
  driversTrafficFileNumber!: string;
  driversLicenseNumber!: string;
  vehicleSpeed!: string | number;
  wasPolicePresent!: string;
  ticketNumber!: string;
  policeId!: string;
  region!: string;
  category!: string;
}

export class RestfulOutTrafficFineHeatmap {
  message!: string;
  code!: string;
  status!: number;
  result!: Array<OutTrafficFineHeatmap>;
}

export class OutTrafficFineHeatmap {
  coordinate!: string;
  elevation!: number;
}