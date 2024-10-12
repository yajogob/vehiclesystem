import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class MessageService {
  constructor(private toastr: ToastrService) {}

  private toastrConfig = {
    positionClass: 'toast-top-center',
    extendedTimeOut: 500,
    timeOut: 3000,
    easeTime: 300,
    newestOnTop: true,
  };

  success(message : string, title = '', config = {}) :void {
    const allConfig = Object.assign(this.toastrConfig, config);
    this.toastr.success(message, title, allConfig);
  }

  error(message : string, title = '', config = {}) :void {
    const allConfig = Object.assign(this.toastrConfig, config);
    this.toastr.error(message, title, allConfig);
  }

  warning(message : string, title = '', config = {}) :void {
    const allConfig = Object.assign(this.toastrConfig, config);
    this.toastr.warning(message, title, allConfig);
  }

  info(message : string, title = '', config = {}) :void {
    const allConfig = Object.assign(this.toastrConfig, config);
    this.toastr.info(message, title, allConfig);
  }
}
