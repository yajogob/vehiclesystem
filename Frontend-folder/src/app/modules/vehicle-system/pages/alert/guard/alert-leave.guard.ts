import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertMapComponent } from '../alert-map.component';

@Injectable()
export class AlertMapLeaveGuard implements CanDeactivate<AlertMapComponent> {

  canDeactivate = (component: AlertMapComponent): Observable<boolean> | boolean => {
    // unsubscribe all Subscription
    for (const key in component) {
      if(component[key as keyof AlertMapComponent] instanceof Subscription) {
        (component[key as keyof AlertMapComponent] as Subscription).unsubscribe();
      }
    }
    return true;
  };
}
