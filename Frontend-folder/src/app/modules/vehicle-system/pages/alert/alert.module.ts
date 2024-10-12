import { AlertHttpRequest } from '../../services/alert/http.service';
import { AlertMapComponent } from './alert-map.component';
import { AlertTableModalComponent } from './components/alert-table-modal/alert-table-modal.component';
import { BehavioralAlertsComponent } from './components/behavioral-alerts/behavioral-alerts.component';
import { CardViewPublicComponent } from './components/card-view-folder/card-view-public/card-view-public.component';
import { CardViewComponent } from './components/card-view-folder/card-view/card-view.component';
import { CreateNewtaskComponent } from './components/create-newtask/create-newtask.component';
import { GeofenceAlertsComponent } from './components/geofence-alerts/geofence-alerts.component';
import { ModeSwitchComponent } from './components/mode-switch/mode-switch.component';
import { NoNumberPlateComponent } from './components/no-number-plate/no-number-plate.component';
import { WatchlistAlertsComponent } from './components/watchlist-alerts/watchlist-alerts.component';
import { AlertMapLeaveGuard } from './guard/alert-leave.guard';

export const AlertDeclarations = [
  AlertMapComponent,
  WatchlistAlertsComponent,
  BehavioralAlertsComponent,
  GeofenceAlertsComponent,
  CreateNewtaskComponent,
  ModeSwitchComponent,
  CardViewComponent,
  CardViewPublicComponent,
  AlertTableModalComponent,
  NoNumberPlateComponent,
];

export const AlertProviders = [
  AlertHttpRequest,
  AlertMapLeaveGuard,
];
