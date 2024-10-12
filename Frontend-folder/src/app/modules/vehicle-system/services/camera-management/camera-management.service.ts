import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Restful } from '../../interfaces/ai-algorithm/ai-algorithm';
import { CameraInfo } from '../../interfaces/basic-map/http.response';
import { InCameraDelete, InCameraSearch, PromiseOutCameraSearch } from '../../interfaces/camera-management/camera-management';
import { MessageService } from '../common/message.service';
import { RequestService } from '../request/request.service';

/**
 * camera management Business Services
*/
@Injectable()
export class CameraManagementService {
  constructor(
    private requestService: RequestService,
    private messageService: MessageService,
  ) {}

  // query camera management list
  cameraListSearch = (params: InCameraSearch): Observable<PromiseOutCameraSearch> => {
    return new Observable( subscribe => {
      this.requestService.cameraListSearch(params).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              subscribe.next(res.result);
              subscribe.complete();
            } else {
              this.messageService.error(res.message as string);
              subscribe.error(res);
            }
          },
        },
      );
    });
  };

  // Device update
  cameraUpdate = (params: CameraInfo): Observable<Restful> => {
    return new Observable( subscribe => {
      this.requestService.cameraUpdate(params).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              subscribe.next(res);
              subscribe.complete();
            } else {
              subscribe.error(res);
            }
          },
        },
      );
    });
  };

  // Device Delete
  cameraDelete = (params: InCameraDelete): Observable<Restful> => {
    return new Observable( subscribe => {
      this.requestService.cameraDelete(params).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              subscribe.next(res);
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
