import { FakePlateBusinessService } from '../../services/fake-plate/fake-plate-business.service';
import { FakePlateService } from '../../services/fake-plate/fake-plate.service';
import { FakePlateDetailsLayerComponent } from './components/fake-plate-details-layer/fake-plate-details-layer.component';
import { FakePlateNoDatabaseTableComponent } from './components/fake-plate-no-database-table/fake-plate-no-database-table.component';
import { FakePlateNoDatabaseComponent } from './components/fake-plate-no-database/fake-plate-no-database.component';
import { FakePlateSideSearchComponent } from './components/fake-plate-side-search/fake-plate-side-search.component';
import { FakePlateTableComponent } from './components/fake-plate-table/fake-plate-table.component';
import { FakePlateComponent } from './fake-plate.component';

export const FakePlateDeclarations = [
  FakePlateComponent,
  FakePlateSideSearchComponent,
  FakePlateTableComponent,
  FakePlateDetailsLayerComponent,
  FakePlateNoDatabaseComponent,
  FakePlateNoDatabaseTableComponent,
];

export const FakePlateProviders = [
  FakePlateService,
  FakePlateBusinessService,
];
