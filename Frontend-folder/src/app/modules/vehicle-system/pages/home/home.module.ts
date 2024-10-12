import { HomeHttpRequest } from '../../services/home/http.service';
import { LiveTrafficComponent } from './components/live-traffic/live-traffic.component';
import { TopAlarmComponent } from './components/top-alarm/top-alarm.component';
import { TrafficSitesComponent } from './components/traffic-sites/traffic-sites.component';
import { VehicleCountsComponent } from './components/vehicle-counts/vehicle-counts.component';
import { HomeMapComponent } from './home-map.component';

export const HomeDeclarations = [
  HomeMapComponent,
  VehicleCountsComponent,
  TrafficSitesComponent,
  LiveTrafficComponent,
  TopAlarmComponent,
];

export const HomeProviders = [
  HomeHttpRequest,
];
