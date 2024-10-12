import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from "./auth.service";
import { ConfigService } from "./config.service";
import { LoggerService } from './logger.service';
/** Pass untouched request through to the next request handler. */
@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private logger: LoggerService,
  ) { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let flag = true;
    if(!this.authService.getToken() || req.url.indexOf('oauth2/password') >= 0) {
      flag = false;
    }

    req.headers.set('Content-Type', 'application/json');

    let newUrl = req.url;
    if(newUrl.indexOf('/') == 0){
      newUrl = this.configService.getConfig().xhr_base_url + req.url;
    }

    const newHttpRequest = req.clone({
      url: newUrl,
      headers: flag ? req.headers.set('token', this.authService.getToken()) : req.headers,
    });
    
    return next.handle(newHttpRequest);
  }
}
