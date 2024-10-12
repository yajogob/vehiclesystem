import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { EnvironmentService } from 'src/app/services/EnvironmentService';
import { LoginService } from '../../auth/services/login.service';
import { SiteSelectorBehaviorSubject } from '../components/site-selector/site-selector.BehaviorSubject';
import { MeunMapType, NoMeunMapType, OutLoginParams, TRAFFICMenuList } from '../interfaces/rbac';
import { MeunMapClass, NoMeunMapClass, PathLib } from '../libs/path-library';
import { RouterService } from '../services/router.service';
import { AuthService } from './auth.service';

@Injectable()
export class LoginGuard implements CanActivate {
  private meunMap: MeunMapType = MeunMapClass.map;
  private NoMeunMap: NoMeunMapType = NoMeunMapClass.map;

  constructor(
    private routerService: RouterService,
    private loginService: LoginService,
    private siteSelectorBehaviorSubject: SiteSelectorBehaviorSubject,
    private environmentService: EnvironmentService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const locationSplit = location.href.split('?token=');
    const refresh_token = locationSplit[1];
    if (refresh_token && refresh_token.length) {
      return new Observable<boolean>(observer => {
        localStorage.setItem('menuList', '');
        localStorage.setItem('UserInfoKey', '');
        const observerNext = (path: string): void => {
          observer.next(false);
          observer.complete();
          this.routerService.navigate([path]);
        };
        const observerError = (): void => {
          observer.next(false);
          observer.complete();
          const SSO_LOGIN = this.environmentService.getGlobalVariable('SSO_LOGIN');
          window.location.href = `${location.protocol}//${SSO_LOGIN}`;  // login page url
        };
        const routePath = route.routeConfig?.path || '';
        const nextPath = routePath.includes('vs') ? routePath : PathLib.HOME;
        this.loginService.ssoLoginByRefreshToken({refresh_token}).subscribe({
          next: loginRes => {
            if (loginRes.code === '0' && loginRes.result) {
              AuthService.setUserInfo(loginRes.result);
              this.loginService.getMenuList().subscribe({
                next: menuRes => {
                  if (menuRes.code === '0' && menuRes.result) {
                    const list = menuRes.result.permittedModuleInfo?.TRAFFIC || [];
                    localStorage.setItem('menuList', JSON.stringify(list));
                    observerNext(nextPath);
                  } else {
                    observerError();
                  }
                },
                error: () => {
                  observerError();
                },
              });
            } else {
              observerError();
            }
          },
          error: () => {
            observerError();
          },
        });
      });
    }
    return this.checkAuthorization(route);
  }

  checkAuthorization(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Authority judgment
    const meunListRes = JSON.parse(localStorage.getItem('menuList') || '[]');
    const haveMuenAuth = meunListRes.some((item: TRAFFICMenuList) => {
      const meunMapKeys = Object.keys(this.meunMap);
      for (let i = 0; i < meunMapKeys.length; i++) {
        const key = meunMapKeys[i];
        if (item.uriSet.includes(key)) {
          return this.meunMap[key as keyof MeunMapType] === route.routeConfig?.path;
        }
      }
      return false;
    });
    const haveNoMuenAuth = meunListRes.some((item: TRAFFICMenuList) => {
      return this.NoMeunMap[item.uriSet as keyof NoMeunMapType] === route.routeConfig?.path;
    });

    let next = false;
    if (haveMuenAuth || haveNoMuenAuth) next = true;

    // Token judgment
    const userKey: OutLoginParams | null = JSON.parse(localStorage.getItem('UserInfoKey') as string);
    if (!userKey || !userKey.access_token) {
      const SSO_LOGIN = this.environmentService.getGlobalVariable('SSO_LOGIN');
      window.location.href = `${location.protocol}//${SSO_LOGIN}`;  // login page url
      return false;
    } else if (userKey && userKey.access_token && next) {
      this.siteSelectorBehaviorSubject.setOriginalSiteTree(true);
      return true;
    } else if (userKey && userKey.access_token && !next) {
      return false;
    }
    return false;
  }
}
