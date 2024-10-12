import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthModule } from './modules/auth';
import { VehicleSystemModule } from './modules/vehicle-system/vehicle-system.module';
const routes: Routes = [
  { path: 'vs/auth', loadChildren: () => AuthModule },
  { path: '', loadChildren: () => VehicleSystemModule },
  { path: '**', redirectTo: '' },
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
})
export class AppRoutingModule { }
