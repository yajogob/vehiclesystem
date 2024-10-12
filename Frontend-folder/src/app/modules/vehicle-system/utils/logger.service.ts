import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
enum LoggerLevel {
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

@Injectable()
export class LoggerService {
  constructor(
    private configService: ConfigService,
  ) {}

  info (...args: unknown[]): void {
    // eslint-disable-next-line no-console
    LoggerLevel.INFO >= this.configService.getConfig().logger_level && console.log(...args);
  }

  warning (...args: unknown[]): void {
    // eslint-disable-next-line no-console
    LoggerLevel.WARN >= this.configService.getConfig().logger_level && console.warn(...args);
  }

  error (...args: unknown[]): void {
    // eslint-disable-next-line no-console
    LoggerLevel.ERROR >= this.configService.getConfig().logger_level && console.error(...args);
  }
}
