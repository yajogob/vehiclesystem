import { Injectable } from '@angular/core';
export interface Config {
  xhr_base_url: string,
  xhr_with_credentials: boolean
  xhr_timeout: number,
  page_log_out: string,
  logger_level: number
}

@Injectable()
export class ConfigService {
  private config: Config = {
    xhr_base_url: '/backend-lpr',
    xhr_with_credentials: false,
    xhr_timeout: 30000,
    page_log_out: '/auth/login',
    logger_level: 10,
  };


  public getConfig(): Config {
    return this.config;
  }
}
