import { Injectable } from '@angular/core';
import { TrafficSearchConstLibrary } from '../../pages/traffic-search/libs/traffic-search-const-library';
import { TrafficSearchItem } from '../../interfaces/traffic-search/traffic-search';

type returnType = TrafficSearchItem
/**
 * Local Storage Services
 *
 * @export
 * @abstract
 * @class TrafficSearchStorageService
 */
@Injectable()
export class TrafficSearchStorageService {
  commonAccess = (name: string, data?: unknown): void | returnType=> {
    if (data === TrafficSearchConstLibrary.DEL) {
      window.sessionStorage.removeItem(name);
    } else if (data && data !== TrafficSearchConstLibrary.DEL) {
      window.sessionStorage.setItem(name, JSON.stringify(data));
    } else {
      const params = window.sessionStorage.getItem(name);
      return JSON.parse(params as string);
    }
  };
}
