import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeService } from '@core/services/theme.service';
import { Theme } from '@enums/theme';
import { TranslocoService } from '@ngneat/transloco';
import { PathLib } from 'src/app/modules/vehicle-system/libs/path-library';
import { MessageService } from '../../../vehicle-system/services/common/message.service';
import { RbacService } from '../../../vehicle-system/services/rbac/rbac.service';
import { AuthService, UserInfo } from '../../../vehicle-system/utils/auth.service';
import { I18nService } from '../../../vehicle-system/utils/i18n.service';
import { LoginParams, LoginResponse, LoginService } from '../../services/login.service';
@Component({
  selector: 'vs-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    name: 'tsi.admin',
    password: 'Passw0rd',
  });

  errorMessage = '';
  isLight = true;
  theme: Theme = Theme.LIGHT;
  language = 'en';
  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private readonly translocoService: TranslocoService,
    private themeService: ThemeService,
    private i18nService: I18nService,
    private router: Router,
    private messageService: MessageService,
    private rbacService: RbacService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    sessionStorage.clear();
    this.theme = this.themeService.getColorTheme();
    this.isLight = this.theme == Theme.LIGHT;
    this.language = this.i18nService.getLanguage();
    this.i18nService.init();
  }

  async login(): Promise<void> {
    localStorage.setItem('menuList', '');
    localStorage.setItem('UserInfoKey', '');
    try {
      const user = <LoginParams>this.loginForm.value;
      const res = this.loginService.login(user);
      res.subscribe((data: LoginResponse) => {
        // eslint-disable-next-line no-console
        if (data?.result?.access_token) {
          const userinfo = new UserInfo(user.name, data?.result);
          AuthService.setUserInfo(userinfo);
          this.getMenuList();
        } else if (AuthService.getUserInfo()) {
          this.getMenuList();
        } else {

          this.errorMessage = data.message || this.translocoService.translate('vs.login.message.invalid.username.password');
          this.messageService.error(this.errorMessage);
        }
      });
    } catch (e) {
      this.errorMessage = this.translocoService.translate('vs.login.message.invalid.username.password');
      this.messageService.error(this.errorMessage);
    }
  }

  getMenuList(): void {
    this.rbacService.getMenuList().subscribe(
      {
        next: () => {
          this.router.navigate([PathLib.HOME]);
        },
      },
    );
  }

  changeTheme(): void {
    this.theme = (this.theme == Theme.DARK ? Theme.LIGHT : Theme.DARK);
    this.isLight = this.theme == Theme.LIGHT;
    this.themeService.update(this.theme);
  }

  public onSwitchLanguge(): void {
    this.i18nService.update(this.language);
  }
}
