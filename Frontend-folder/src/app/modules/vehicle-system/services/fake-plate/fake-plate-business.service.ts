import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { FakePlateSearchParams, OutTrafficCheckPlateResult } from '../../interfaces/fake-plate/fake-plate';
import { MessageService } from '../common/message.service';
import { FakePlateService } from './fake-plate.service';

@Injectable()
export class FakePlateBusinessService {

  constructor(
    private fakePlateService: FakePlateService,
    private messageService: MessageService,
  ) {
  }

  trafficCheckPlate = (params: FakePlateSearchParams): Observable<Array<OutTrafficCheckPlateResult>> => {
    return new Observable( subscribe => {
      this.fakePlateService.trafficCheckPlate(params).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              subscribe.next(res.result as Array<OutTrafficCheckPlateResult>);
              subscribe.complete();
            } else {
              this.messageService.error(res.message);
              subscribe.error(res.message);
            }
          },
          error: err => {
            subscribe.error(err);
          },
        },
      );
    });
  };

}
