import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MadalType } from '../interfaces/key-value-type';

@Injectable()
export class PublicModalService { 
  private showModal$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public popConirmShow$ = new BehaviorSubject<MadalType>({} as MadalType);
  public divPosition$ = new BehaviorSubject<DOMRect>({} as DOMRect);

  // constructor() {}

  // show 
  showModal(): void {
    this.showModal$.next(true);
  }

  // hide
  hideModal(): void {
    this.showModal$.next(false);
  }

  // get showModal$ value
  getShowModal(): Observable<boolean> {
    return this.showModal$.asObservable();
  }

  showPopConirm(info?: MadalType, isShow = true): void {
    this.popConirmShow$.next(Object.assign(info as MadalType, {isShow}));
  }
}
