import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslocoModule } from '@ngneat/transloco';
import { SharedModule } from '@shared/shared.module';
import { NgxUiLoaderModule } from "ngx-ui-loader";
import { LoginService } from '../auth/services/login.service';
import { HttpRequestService } from '../vehicle-system/services/http-request.service';
import { AuthService } from '../vehicle-system/utils/auth.service';
import { ConfigService } from '../vehicle-system/utils/config.service';
import { HttpRequestInterceptor } from '../vehicle-system/utils/http-request-interceptor';
import { LoggerService } from '../vehicle-system/utils/logger.service';
import { VehicleSystemComponentsModule } from './components/components.module';
import { TableActionsRendererComponent } from './components/table-actions-renderer/table-actions-renderer.component';
import { AiAlgorithmDeclarations, AiAlgorithmProviders } from './pages/ai-algorithm/ai-algorithm.module';
import { AlertDeclarations, AlertProviders } from './pages/alert/alert.module';
import { BasicMapDeclarations, BasicMapProviders } from './pages/basic-map/basic-map.module';
import { FakePlateDeclarations, FakePlateProviders } from './pages/fake-plate/fake-plate.module';
import { HomeDeclarations, HomeProviders } from './pages/home/home.module';
import { IndexComponent } from './pages/index/index.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { RentalDeclarations, RentalProviders } from './pages/rental/rental.module';
import { CameraManagementComponent } from './pages/settings/camera-management/camera-management.component';
import { CameraManagementSearchComponent } from './pages/settings/components/camera-management-search/camera-management-search.component';
import { EditCameraListComponent } from './pages/settings/components/edit-camera-list/edit-camera-list.component';
import { TrafficFineDeclarations } from './pages/traffic-fine/traffic-fine.module';
import { TrafficSearchDeclarations, TrafficSearchProviders } from './pages/traffic-search/traffic-search.module';
import { VehicleProfileDeclarations, VehicleProfileProviders } from './pages/vehicle-profile/vehicle-profile.module';
import { CameraManagementService } from './services/camera-management/camera-management.service';
import { MessageService } from "./services/common/message.service";
import { CommonHttpRequest } from './services/common/request.service';
import { CodeItemService } from './services/global-subscription.service';
import { MapService } from './services/map-event.service';
import { PublicModalService } from './services/public-modal.service';
import { RequestService } from './services/request/request.service';
import { RouterService } from './services/router.service';
import { ThemeSubject } from './services/theme.service';
import { TrafficFineService } from './services/traffic-fine/traffic-fine.service';
import { LoginGuard } from './utils/login.guard';
import { RefreshTokenInterceptor } from './utils/refresh-token-interceptor';
import { VehicleSystemRoutingModule } from './vehicle-system-routing.module';
import { VehicleSystemComponent } from './vehicle-system.component';

@NgModule({
  declarations: [
    ...HomeDeclarations,
    ...AlertDeclarations,
    ...BasicMapDeclarations,
    ...AiAlgorithmDeclarations,
    ...RentalDeclarations,
    ...TrafficSearchDeclarations,
    ...VehicleProfileDeclarations,
    ...FakePlateDeclarations,
    ...TrafficFineDeclarations,
    VehicleSystemComponent,
    IndexComponent,
    MyProfileComponent,
    CameraManagementComponent,
    CameraManagementSearchComponent,
    TableActionsRendererComponent,
    EditCameraListComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    VehicleSystemRoutingModule,
    TranslocoModule,
    VehicleSystemComponentsModule,
    VehicleSystemRoutingModule,
    NgOptimizedImage,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    VehicleSystemRoutingModule,
    NgxUiLoaderModule,
    HttpClientModule,
  ],
  providers: [
    PublicModalService,
    TrafficFineService,
    RequestService,
    MapService,
    ThemeSubject,
    ...HomeProviders,
    ...AlertProviders,
    ...BasicMapProviders,
    ...AiAlgorithmProviders,
    ...RentalProviders,
    ...TrafficSearchProviders,
    ...VehicleProfileProviders,
    ...FakePlateProviders,
    CodeItemService,
    CommonHttpRequest,
    RouterService,
    CameraManagementService,
    AuthService,
    ConfigService,
    HttpRequestService,
    LoggerService,
    MessageService,
    LoginService,
    LoginGuard,
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true },
  ],
})
export class VehicleSystemModule { }
