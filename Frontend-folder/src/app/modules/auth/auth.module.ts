import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoRootModule } from '../../transloco-root.module';
import { MessageService } from '../vehicle-system/services/common/message.service';
import { HttpRequestService } from '../vehicle-system/services/http-request.service';
import { RbacService } from '../vehicle-system/services/rbac/rbac.service';
import { RouterService } from '../vehicle-system/services/router.service';
import { AuthService } from '../vehicle-system/utils/auth.service';
import { ConfigService } from '../vehicle-system/utils/config.service';
import { HttpRequestInterceptor } from '../vehicle-system/utils/http-request-interceptor';
import { I18nService } from '../vehicle-system/utils/i18n.service';
import { LoggerService } from '../vehicle-system/utils/logger.service';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './pages/login';
import { LoginService } from './services/login.service';

const COMPONENTS = [
  AuthComponent,
  LoginComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    HttpClientModule,
    TranslocoRootModule,
  ],
  declarations: [
    ...COMPONENTS,
  ],
  providers: [
    LoginService,
    I18nService,
    LoggerService,
    AuthService,
    ConfigService,
    HttpRequestService,
    RbacService,
    MessageService,
    RouterService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
  ],
})
export class AuthModule {
}
