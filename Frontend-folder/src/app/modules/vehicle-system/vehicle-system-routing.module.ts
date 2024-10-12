import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PathLib } from './libs/path-library';
import { AiAlgorithmComponent } from './pages/ai-algorithm/ai-algorithm.component';
import { AiAllTaskComponent } from './pages/ai-algorithm/router-page/ai-all-task/ai-all-task.component';
import { AlertMapComponent } from './pages/alert/alert-map.component';
import { AlertMapLeaveGuard } from './pages/alert/guard/alert-leave.guard';
import { FakePlateComponent } from './pages/fake-plate/fake-plate.component';
import { HomeMapComponent } from './pages/home/home-map.component';
import { IndexComponent } from './pages/index/index.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { RentalComponent } from './pages/rental/rental.component';
import { CarRentalHistoryComponent } from './pages/rental/router-page/car-rental-history/car-rental-history.component';
import { CarRentalListComponent } from './pages/rental/router-page/car-rental-list/car-rental-list.component';
import { CameraManagementComponent } from './pages/settings/camera-management/camera-management.component';
import { TrafficFineComponent } from './pages/traffic-fine/traffic-fine.component';
import { TrafficSearchComponent } from './pages/traffic-search/traffic-search.component';
import { VehicleProfileComponent } from './pages/vehicle-profile/vehicle-profile.component';
import { LoginGuard } from './utils/login.guard';
import { VehicleSystemComponent } from './vehicle-system.component';

const routes: Routes = [{
  path: '',
  component: VehicleSystemComponent,
  children: [{
    path: PathLib.HOME,
    component: HomeMapComponent,
    canActivate: [LoginGuard],
  }, {
    path: PathLib.TRAFFIC_SEARCH,
    component: TrafficSearchComponent,
    canActivate: [LoginGuard],
    data: { keep: true },
  }, {
    path: PathLib.ALERT,
    component: AlertMapComponent,
    canActivate: [LoginGuard],
    canDeactivate: [AlertMapLeaveGuard],
    data: { keep: true },
  }, {
    path: PathLib.VEHICLE_PROFILE,
    component: VehicleProfileComponent,
    canActivate: [LoginGuard],
  }, {
    path: PathLib.AI_ALGORITHM,
    component: AiAlgorithmComponent,
    canActivate: [LoginGuard],
  }, {
    path: PathLib.TRAFFIC_FINE,
    component: TrafficFineComponent,
    canActivate: [LoginGuard],
  }, {
    path: PathLib.RENTAL,
    component: RentalComponent,
    canActivate: [LoginGuard],
    data: { keep: true },
  }, {
    path: PathLib.FAKE_PLATE,
    component: FakePlateComponent,
    canActivate: [LoginGuard],
  }, {
    path: PathLib.INDEX,
    component: IndexComponent,
    canActivate: [LoginGuard],
  }, {
    path: PathLib.MY_PROFILE,
    component: MyProfileComponent,
    canActivate: [LoginGuard],
  }, {
    path: PathLib.CAR_RENTAL_LIST,
    component: CarRentalListComponent,
    canActivate: [LoginGuard],
    data: { keep: true }, // Maintain routing status
  }, {
    path: PathLib.CAR_RENTAL_HISTORY,
    component: CarRentalHistoryComponent,
    canActivate: [LoginGuard],
  }, {
    path: PathLib.CAMERA_MAMANGERMENT,
    component: CameraManagementComponent,
    canActivate: [LoginGuard],
  }, {
    path: PathLib.TASK_MANAGEMENT,
    component: AiAllTaskComponent,
    canActivate: [LoginGuard],
  }, {
    path: '',
    redirectTo: PathLib.HOME,
    pathMatch: 'full',
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehicleSystemRoutingModule {
}
