import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DateKey } from '../../interfaces/key-value-type';
import { InTrafficFineSearch, OutTrafficFineHeatmap, PromiseOutTrafficFineSearch } from '../../interfaces/traffic-fine/traffic-fine';
import { MessageService } from '../common/message.service';
import { RequestService } from '../request/request.service';

/**
 * Fine Business Services
*/
@Injectable()
export class TrafficFineService {
  toolBoxToBusinessDateChange$: BehaviorSubject<DateKey> = new BehaviorSubject<DateKey>({} as DateKey);
  businessToToolBoxDateChange$: BehaviorSubject<DateKey> = new BehaviorSubject<DateKey>({} as DateKey);

  constructor(
    private requestService: RequestService,
    private messageService: MessageService,
  ) {}

  // Transportation fine inquiry
  trafficFineSearch = (params: InTrafficFineSearch): Observable<PromiseOutTrafficFineSearch> => {
    return new Observable( subscribe => {
      this.requestService.trafficFineSearch(params).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              subscribe.next(res.result);
              subscribe.complete();
            } else {
              res.message && this.messageService.error(res.message);
              subscribe.error(res);
            }
          },
        },
      );
    });
  };

  searchHeatMap = (params: InTrafficFineSearch): Observable<Array<OutTrafficFineHeatmap>> => {
    return new Observable( subscribe => {
      this.requestService.getTrafficFineHeatmap(params).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              subscribe.next(res.result);
              subscribe.complete();
            } else {
              res.message && this.messageService.error(res.message);
              subscribe.error(res);
            }
          },
        },
      );
    });
  };
}
