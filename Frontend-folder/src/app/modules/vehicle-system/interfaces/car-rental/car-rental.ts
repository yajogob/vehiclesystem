//
class PageInfo {
  pageNo!: number;
  pageSize!: number;
  totalPages?: number;
  total!: number;
}
export class InRentalCompanyListSearch {
  companyName!: string;
  pageNo!: string | number;
  pageSize!: string | number;
}

export class PromiseOutRentalCompanyListSearch extends PageInfo {
  data!: Array<CompanyInfo>;
}

export class RestfulOutRentalCompanyList {
  code!: string;
  status!: number;
  result!: PromiseOutRentalCompanyListSearch;
}

export interface CompanyInfo {
  email: string,
  tradeLicenseNum: string;
  emiratesCode: string,
  address: string;
  companyArabicName: string,
  companyEnglishName: string,
  id: string,
  telephone1: string;
  telephone2: string;
  [propName: string]: string | number | boolean;
}

export class InRentalCompanyDetailsSearch {
  companyId!: string;
}

export class OutCompanyDetailsData {
  emiratesCode!: string;
  email!: string;
  address!: string;
  tradeLicenseNum!: string;
  companyArabicName!: string;
  companyEnglishName!: string;
  telephone2!: string;
  telephone1!: string;
  id!: string;
}

export class RestfulOutCompanyDetailsData {
  code!: string;
  status!: number;
  result!: OutCompanyDetailsData;
}

export class InCarRentalInfoListSearch {
  companyId!: string;
  pageNo?: number;
  pageSize?: number;
  plateCode?: string;
  emirates?: string;
  plateNumber?: string;
  plateColor?: string;
  fromDate?: string;
  toDate?: string;
}

export class OutCarRentalInfoListSearch {
  chassisNumber!: string;
  modelYear!: string;
  color!: string;
  plateType!: string;
  registrationNum!: string;
  registrationDate!: string;
  plateNumber!: string;
  status!: string;
  registrationPlace!: string;
  companyNumber!: string;
  make!: string;
  model!: string;
  registrationExpiry!: string;
  id!: string;
  carNo!: string;
  channel!: string;
  plateCategory!: string;
  region!: string;
}

export class OutCarRentalInfoListResult extends PageInfo {
  data!: Array<OutCarRentalInfoListSearch>;
}

export class RestfulOutCarRentalInfoList {
  code!: string;
  status!: number;
  result!: OutCarRentalInfoListResult;
}

export class InCarRentalRecordsListSearch {
  id!:  string;
  name!:  string;
  startDateTime!:  string | number;
  endDateTime!:  string | number;
}

export class InCarRentalTransactions {
  pageSize!: number;
  toDate!: string | number;
  pageNo!: number;
  fromDate!: string | number;
  emirates!: string;
  plateCode!: string;
  renterName!: string;
  carNo!: string;
}

export class OutCarRentalTransactions {
  renterDocumentType!: string;
  transactionNumber!: string;
  agreementNumber!: string;
  renterNationality!: string;
  emirates!: string;
  transactionDateTimeout!: string;
  transactionDateTimeReturn!: string;
  customer_invoice_number!: string;
  rentalVehicleSerialNumber!: string;
  agreement_NO!: string;
  renter_ARABIC_NAME!: string;
  renter_ENGLISH_NAME!: string;
  renter_nationality!: string;
  residence_country!: string;
  rentalVehicleTransDateOut!: string;
  rentalVehicleTransDateReturn!: string;
  document_number!: string;
  residenceCountry!: string;
  document_ISSUE_DATE!: string;
  expiryDate!: string;
  gender!: string;
  renter_TELEPHONE!: string;
  customerInvoiceNumber!: string;
  renterArabicName!: string;
  transDateOut!: string;
  renterEnglishName!: string;
  renterResidency!: string;
  renterMobile!: string;
  renterSex!: string;
  documentExpiryDate!: string;
  documentIssueDate!: string;
  documentNumber!:string;
  transDateReturn!: string;
  activeColorWidth!: number;
  totalRentalDays!: number;
  alreadyRentalDays!: number;
  startTimestamp!: number;
  endTimestamp!: number;
}

export class PromiseOutCarRentalTransactions extends PageInfo {
  data!: Array<OutCarRentalTransactions>;
}

export class RestfulOutCarRentalTransactions {
  code!: string;
  status!: number;
  result!: PromiseOutCarRentalTransactions;
}

