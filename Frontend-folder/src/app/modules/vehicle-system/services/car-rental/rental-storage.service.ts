import { Injectable } from "@angular/core";
import { RentalConstLibrary } from "../../pages/rental/libs/rental-const-library";
import { OutCarRentalInfoListSearch } from "../../interfaces/car-rental/car-rental";
type returnType = OutCarRentalInfoListSearch //  a | b | c
/**
 * Local Storage Services
 *
 * @export
 * @abstract
 * @class StorageService
 */
@Injectable()
export class RentalStorageService {
  //
  commonAccess = (name: string, data?: unknown): void | returnType=> {    
    if (data === RentalConstLibrary.DEL) {
      window.sessionStorage.removeItem(name);
    } else if (data && data !== RentalConstLibrary.DEL) {
      window.sessionStorage.setItem(name, JSON.stringify(data));
    } else {
      const params = window.sessionStorage.getItem(name);
      return JSON.parse(params as string);
    }
  };
}
