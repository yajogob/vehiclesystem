import { VehicleProfileService } from '../../services/vehicle-profile/vehicle-profile.service';
import { SideVpListComponent } from './components/side-vp-list/side-vp-list.component';
import { SideVpSearchComponent } from './components/side-vp-search/side-vp-search.component';
import { VpDetailsComponent } from './components/vp-details/vp-details.component';
import { VpTimeLineComponent } from './components/vp-time-line/vp-time-line.component';
import { VehicleProfileComponent } from './vehicle-profile.component';

export const VehicleProfileDeclarations = [
  VehicleProfileComponent,
  SideVpSearchComponent,
  SideVpListComponent,
  VpDetailsComponent,
  VpTimeLineComponent,
];

export const VehicleProfileProviders = [
  VehicleProfileService,
];
