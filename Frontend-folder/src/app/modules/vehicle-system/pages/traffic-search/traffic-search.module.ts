import { TrafficSearchService } from '../../services/traffic-search/traffic-search.service';
import { TrafficSearchStorageService } from '../../services/traffic-search/traffic-search-storage.service';

import { TrafficSearchComponent } from './traffic-search.component';
import { SideSearchComponent } from './components/side-search/side-search.component';
import { SearchTableComponent } from './components/search-table/search-table.component';

export const TrafficSearchDeclarations = [
  TrafficSearchComponent,
  SideSearchComponent,
  SearchTableComponent,
];

export const TrafficSearchProviders = [
  TrafficSearchService,
  TrafficSearchStorageService,
];
