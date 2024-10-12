import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
import { GlobalSubscriptionService } from '../../modules/vehicle-system/services/global-subscription.service';
import { Directive } from '@angular/core';
/**
 * Route reuse strategy. To maintain the state of the routing page, add the： data: { keep: true }
 * example : { path: '', component: component, data: { keep: true } },
*/
@Directive()
export class SimpleReuseStrategy implements RouteReuseStrategy {
  static cacheRouters = new Map<string, DetachedRouteHandle>();

  constructor(
    private globalSubscriptionService: GlobalSubscriptionService,
  ) {}

  // Method for deleting route snapshots (This project is currently not in use)
  public static deleteAllRouteCache(): void {
    SimpleReuseStrategy.cacheRouters.forEach((handle: unknown, key: string) => {
      SimpleReuseStrategy.deleteRouteCache(key);
    });
  }

  // Method for deleting route snapshots
  public static deleteRouteCache(url: string): void {
    if (SimpleReuseStrategy.cacheRouters.has(url)) {
      SimpleReuseStrategy.cacheRouters.delete(url);
    }
  }

  // one Triggering when entering a route, whether to reuse the same route
  shouldReuseRoute = (future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean => {
    return future.routeConfig === curr.routeConfig && JSON.stringify(future.params) === JSON.stringify(curr.params);
  };

  // Get Storage Routing
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const url = this.getFullRouteURL(route);
    if (route.data['keep'] && SimpleReuseStrategy.cacheRouters.has( url) ) {
      return SimpleReuseStrategy.cacheRouters.get(url) as DetachedRouteHandle;
    } else {
      return null;
    }
  }

  // Allow reuse of routes？
  shouldDetach = (route: ActivatedRouteSnapshot): boolean => {
    return Boolean(route.data['keep']);
  };

  // Triggered when the route leaves, storing the route
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const url = this.getFullRouteURL(route);
    SimpleReuseStrategy.cacheRouters.set(url, handle);
  }

  //  Allow restoration of routes？
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const url = this.getFullRouteURL(route);
    const routeIsReuse = this.globalSubscriptionService.routeIsReuse$.value;
    setTimeout(() => {
      this.globalSubscriptionService.routeIsReuse$.next(null);
    });
    return Boolean(route.data['keep']) && SimpleReuseStrategy.cacheRouters.has(url) && url !== routeIsReuse?.path && !routeIsReuse?.keep;
  }

  // Obtain the current routing URL
  private getFullRouteURL(route: ActivatedRouteSnapshot): string {
    const { pathFromRoot } = route;
    let fullRouteUrlPath: string[] = [];
    pathFromRoot.forEach((item: ActivatedRouteSnapshot) => {
      fullRouteUrlPath = fullRouteUrlPath.concat( this.getRouteUrlPath(item) );
    });
    return `/${fullRouteUrlPath.join('/')}`;
  }

  private getRouteUrlPath = (route: ActivatedRouteSnapshot): Array<string> => {
    return route.url.map(urlSegment => urlSegment.path);
  };
}
