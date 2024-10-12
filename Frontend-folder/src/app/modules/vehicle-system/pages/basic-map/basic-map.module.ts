import { MapHttpRequest } from '../../services/basic-map/http.service';
import { BasicMapComponent } from './basic-map.component';
import { AlertDetailComponent } from './components/alert-detail/alert-detail.component';
import { BehavioralPointComponent } from './components/behavioral-point/behavioral-point.component';
import { GeofencePointComponent } from './components/geofence-point/geofence-point.component';
import { MapControllerComponent } from './components/map-controller/map-controller.component';
import { WatchlistPointComponent } from './components/watchlist-point/watchlist-point.component';

export const BasicMapDeclarations = [
  BasicMapComponent,
  AlertDetailComponent,
  BehavioralPointComponent,
  GeofencePointComponent,
  WatchlistPointComponent,
  MapControllerComponent,
];

export const BasicMapProviders = [
  MapHttpRequest,
];
