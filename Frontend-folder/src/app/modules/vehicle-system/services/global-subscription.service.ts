import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CancelRouteReuse, CodeItemsApi } from '../interfaces/key-value-type';

@Injectable({providedIn: 'root'})
export class GlobalSubscriptionService {
  /**
   * Whether the route is reused？
  */
  public routeIsReuse$ = new BehaviorSubject<CancelRouteReuse | null>(null);
  public pointerEventsChange$: Subject<string> = new Subject<string>();
}


export interface CodeItemEventData {
  eventType: string,
  data: Array<CodeItemsApi>
}
export class CodeItemService {
  subject$: BehaviorSubject<CodeItemEventData> = new BehaviorSubject<CodeItemEventData>({eventType: '', data: new Array<CodeItemsApi>});
}
