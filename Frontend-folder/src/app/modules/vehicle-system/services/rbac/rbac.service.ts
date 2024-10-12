import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/modules/auth/services/login.service';
import { EnvironmentService } from 'src/app/services/EnvironmentService';
import { LogoutParams, LogoutResponseResult, TRAFFICMenuList } from '../../interfaces/rbac';
import { MessageService } from '../common/message.service';

/**
 * Vehicle rental business services
 */
@Injectable()
export class RbacService {

  constructor(
    private loginService: LoginService,
    private messageService: MessageService,
    private environmentService: EnvironmentService,
  ) {
  }

  logout = (params: LogoutParams): Observable<LogoutResponseResult> => {
    return new Observable( () => {
      this.loginService.logout(params).subscribe(
        {
          next: res => {
            if (res.code === '0') {
              const SSO_LOGIN = this.environmentService.getGlobalVariable('SSO_LOGIN');
              window.location.href = `${location.protocol}//${SSO_LOGIN}`;  // login page url
              localStorage.removeItem('menuList');
              localStorage.removeItem('UserInfoKey');
            } else {
              res.message && this.messageService.error(res.message);
            }
          },
        },
      );
    });
  };

  getMenuList = (): Observable<Array<TRAFFICMenuList>> => {
    return new Observable( subscribe => {
      this.loginService.getMenuList().subscribe(
        {
          next: res => {
            if (res.code === '0' && res.result) {
              const list = res.result.permittedModuleInfo?.TRAFFIC || [];
              localStorage.setItem('menuList', JSON.stringify(list));
              subscribe.next(list);
            } else {
              res.message && this.messageService.error(res.message);
            }
          },
        },
      );
    });
  };
}
