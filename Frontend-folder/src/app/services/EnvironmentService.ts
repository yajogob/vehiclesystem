import { Injectable, isDevMode } from '@angular/core';
import axios from 'axios';
import { KeyValueType } from '../modules/vehicle-system/interfaces/key-value-type';

@Injectable({providedIn: 'root'})
export class EnvironmentService {
  private globalConfig: KeyValueType = {};

  async initGlobalConfig(): Promise<void> {
    let configFullPath:string = location.protocol + "//" + location.host + location.pathname + 'static/config/global-production.json';
    if (isDevMode()) {
      configFullPath = 'assets/config/global-development.json';
    }
    const response = await axios.get(configFullPath);
    this.globalConfig = response.data;
  }

  getGlobalVariable(key: string): string {
    return this.globalConfig[key];
  }
}
