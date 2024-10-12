import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { CancelRouteReuse } from '../interfaces/key-value-type';
import { GlobalSubscriptionService } from './global-subscription.service';

@Injectable()
export class RouterService {

  constructor(
    private router: Router,
    private globalSubscriptionService: GlobalSubscriptionService,
  ) { }

  /**
   *  router navigate
   */
  navigate(commands: string[], extras?: NavigationExtras): void {
    /**
     * route Reuse start  ↓
    */
    let flag = '/';
    if(commands[0].indexOf('/') === 0) flag = '';
    const value: CancelRouteReuse = {path: `${flag}${commands.join('')}`, keep: false};
    this.globalSubscriptionService.routeIsReuse$.next(value);
    /**
     * route Reuse start  ↑
    */

    // navigate
    this.router.navigate(commands, extras).then(RouterService.navigateSuccess, RouterService.navigateFailed);
  }

  private static navigateSuccess(value: unknown): void {
    if (value !== true) {
      value;
    }
  }

  private static navigateFailed(reason: unknown): void {
    reason;
  }
}
