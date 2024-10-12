/**
 * API const
 */
export class RentalApiLibrary {
  public static readonly rentalCompaniesSearch = "/lpr/rental/companies"; // Transportation fine inquiry
  public static readonly rentalCompanyDetail = "/lpr/rental/companyDetail"; // get: /{companyId} Car rental company detailed information query
  public static readonly carRentalVehiclesSearch = "/lpr/rental/vehicles"; // Car rental information list query
  public static readonly carRentalTransactions = "/lpr/rental/transactions"; // Car rental record information query
}