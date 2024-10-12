import { Injectable } from '@angular/core';
import dayjs from 'dayjs/esm';
import { Observable } from 'rxjs';
import {
  InCarRentalInfoListSearch,
  InCarRentalTransactions,
  InRentalCompanyDetailsSearch,
  InRentalCompanyListSearch,
  OutCarRentalInfoListResult,
  OutCompanyDetailsData,
  PromiseOutCarRentalTransactions,
  PromiseOutRentalCompanyListSearch,
} from '../../interfaces/car-rental/car-rental';
import { RequestService } from '../request/request.service';

/**
 * Vehicle rental business services
 */
@Injectable()
export class CarRentalService {
  constructor(
    private requestService: RequestService,
  ) {
  }

  // Query car rental company information
  rentalCompaniesListSearch = (params: InRentalCompanyListSearch): Observable<PromiseOutRentalCompanyListSearch> => {
    return new Observable( subscribe => {
      this.requestService.rentalCompaniesListSearch(params).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              subscribe.next(res.result);
              subscribe.complete();
            } else {
              subscribe.error(res);
            }
          },
        },
      );
    });
  };

  // Car rental company detailed information query
  rentalCompanyDetailSearch = (params: InRentalCompanyDetailsSearch): Observable<OutCompanyDetailsData> => {
    return new Observable( subscribe => {
      this.requestService.rentalCompanyDetailSearch(params).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              subscribe.next(res.result);
              subscribe.complete();
            } else {
              subscribe.error(res);
            }
          },
        },
      );
    });
  };


  // Car rental record list query
  carRentalVehiclesSearch = (params: InCarRentalInfoListSearch): Observable<OutCarRentalInfoListResult> => {
    return new Observable( subscribe => {
      this.requestService.carRentalVehiclesSearch(params).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              subscribe.next(res.result);
              subscribe.complete();
            } else {
              subscribe.error(res);
            }
          },
        },
      );
    });
  };

  // Car rental record list query
  carRentalTransactions = (params: InCarRentalTransactions): Observable<PromiseOutCarRentalTransactions> => {
    return new Observable( subscribe => {
      this.requestService.carRentalTransactions(params).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              // const obj: OutCarRentalTransactions = {
              //   "emirates": "Dubai",
              //   "renterNationality": "Kuwait",
              //   "documentIssueDate": "14 March 2024",
              //   "transDateReturn": "30 October 2023",
              //   "transDateOut": "14 June 2023",
              //   "renterMobile": "+97158900012",
              //   "renterSex": "Male",
              //   "documentExpiryDate": "13 March 2024",
              //   "documentNumber": "U27283746",
              //   "renterDocumentType": "",
              //   "renterResidency": "UAE",
              //   "renterEnglishName": "Ahamad",
              //   "renterArabicName": "تعطيل",
              //   "customerInvoiceNumber": "11234",
              //   "transactionDateTimeReturn": "24 March 2024,13:00",
              //   "transactionDateTimeout": "14 March 2024,14:30",
              //   "agreementNumber": "666666",
              //   "transactionNumber": "7890091235",
              //   "activeColorWidth": 0,
              //   "totalRentalDays": 0,
              //   "alreadyRentalDays": 0,
              // }
              // const obj2: OutCarRentalTransactions = {
              //   "emirates": "Dubai",
              //   "renterNationality": "Kuwait",
              //   "documentIssueDate": "14 March 2024",
              //   "transDateReturn": "24 March 2024",
              //   "transDateOut": "14 March 2024",
              //   "renterMobile": "+97158900012",
              //   "renterSex": "Male",
              //   "documentExpiryDate": "13 March 2024",
              //   "documentNumber": "U27283746",
              //   "renterDocumentType": "",
              //   "renterResidency": "UAE",
              //   "renterEnglishName": "Ahamad",
              //   "renterArabicName": "تعطيل",
              //   "customerInvoiceNumber": "11234",
              //   "transactionDateTimeReturn": "24 March 2024,13:00",
              //   "transactionDateTimeout": "14 March 2024,14:30",
              //   "agreementNumber": "666666",
              //   "transactionNumber": "7890091235",
              //   "activeColorWidth": 0,
              //   "totalRentalDays": 0,
              //   "alreadyRentalDays": 0,
              // }
              // res.result.data.unshift(obj2); // test
              // res.result.data.unshift(obj); // test
              res.result.data.forEach(item => {
                let startTimestamp = 0;
                let endTimestamp = 0;
                if (Number(item.rentalVehicleTransDateOut)) {
                  startTimestamp = Number(item.rentalVehicleTransDateOut);
                } else {
                  startTimestamp = dayjs(item.rentalVehicleTransDateOut).toDate().getTime();
                }
                if (Number(item.rentalVehicleTransDateReturn)) {
                  endTimestamp = Number(item.rentalVehicleTransDateReturn);
                } else {
                  endTimestamp = dayjs(item.rentalVehicleTransDateReturn).toDate().getTime();
                }
                const today = new Date().getTime();
                const totalDays = Math.ceil((endTimestamp - startTimestamp) / 1000 / 60 / 60 / 24);
                const alreadyDays = Math.ceil((today - startTimestamp) / 1000 / 60 / 60 / 24);
                const activeColorWidth = Math.ceil((alreadyDays / totalDays) * 100);
                item['startTimestamp'] = startTimestamp;
                item['endTimestamp'] = endTimestamp;
                item['totalRentalDays'] = totalDays;
                item['alreadyRentalDays'] = alreadyDays >= totalDays ? totalDays : (alreadyDays >= 0 ? alreadyDays : 0);
                item['activeColorWidth'] = activeColorWidth >= 100 ? 100 : (activeColorWidth >= 0 ? activeColorWidth : 0);
              });
              subscribe.next(res.result);
              subscribe.complete();
            } else {
              subscribe.error(res);
            }
          },
        },
      );
    });
  };
}
