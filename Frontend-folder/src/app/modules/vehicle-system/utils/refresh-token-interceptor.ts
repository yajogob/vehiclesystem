import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { translate } from "@ngneat/transloco";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { catchError, filter, finalize, mergeMap, switchMap, take } from "rxjs/operators";
import { EnvironmentService } from "src/app/services/EnvironmentService";
import { LoginService } from "../../auth/services/login.service";
import { OutLoginParams, RefreshTokenResponse } from "../interfaces/rbac";
import { MessageService } from "../services/common/message.service";
import { AuthService, UserInfo } from "./auth.service";
interface ResponseBody {
  code: string | number;
}

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  private refreshTokenLock = false;   // request lock
  private refreshTokenSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private loginService: LoginService,
    private messageService: MessageService,
    private environmentService: EnvironmentService,
  ) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (req.url.includes('refresh/token') || req.url.includes('.json')) {
      return next.handle(req);
    }

    return next.handle(req).pipe(
      mergeMap((event: HttpEvent<ResponseBody>) => {
        if (event instanceof HttpResponse) {
          // 401: access_token expire
          if ((event.body as ResponseBody)?.code === '401' || (event.body as ResponseBody)?.code === 401) {
            if (this.refreshTokenLock) {
              return this.refreshTokenSubject.pipe(
                filter(result => result),
                take(1),
                switchMap(() => next.handle(this.setAuthenticationToken(req))),
              );
            } else {
              this.refreshTokenLock = true;
              this.refreshTokenSubject.next(false);

              return this.refreshTokenRequest().pipe(
                switchMap(newTokenInfo => {
                  // 402: refresh_token expire
                  if (newTokenInfo.code && Number(newTokenInfo.code) === 402) {
                    this.messageService.error(translate('vs.public.timedOut'));
                    const SSO_LOGIN = this.environmentService.getGlobalVariable('SSO_LOGIN');
                    window.location.href = `${location.protocol}//${SSO_LOGIN}`;  // login page url
                    return of(); // Interrupt process
                  } else {
                    const userKey = this.getSessionUserInfoKey();
                    const userinfo = new UserInfo(userKey?.username, newTokenInfo?.result);
                    AuthService.setUserInfo(userinfo);

                    this.refreshTokenSubject.next(true);
                    return next.handle(this.setAuthenticationToken(req));
                  }
                }),
                finalize(() => (this.refreshTokenLock = false)),
              );
            }
          } else {
            return of(event);
          }
        } else {
          return of(event);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Can Capture Http Error Status
        return throwError(error);
      }),
    );
  }

  private refreshTokenRequest(): Observable<RefreshTokenResponse> {
    const userKey: OutLoginParams | null = JSON.parse(localStorage.getItem('UserInfoKey') as string);
    const params = { refreshToken: userKey?.refresh_token || '' };
    return this.loginService.refreshToken(params);
  }

  private setAuthenticationToken = (request: HttpRequest<unknown>): HttpRequest<unknown> => {
    const userKey = this.getSessionUserInfoKey();
    const useraAcessToken = userKey?.access_token;

    return request.clone({
      body: request.body,
      headers: request.headers.set('token', useraAcessToken || ''),
    });
  };

  private getSessionUserInfoKey = (): OutLoginParams | null => {
    const userKey: OutLoginParams | null = JSON.parse(localStorage.getItem('UserInfoKey') as string);
    return userKey;
  };
}
