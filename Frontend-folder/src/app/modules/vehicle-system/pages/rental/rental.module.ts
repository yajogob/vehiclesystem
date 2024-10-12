import { CarRentalService } from '../../services/car-rental/car-rental.service';
import { RentalStorageService } from '../../services/car-rental/rental-storage.service';
import { CarRentalBackButtonComponent } from './components/car-rental-back-button/car-rental-back-button.component';
import { CarRentalCompanyDetailsComponent } from './components/car-rental-company-details/car-rental-company-details.component';
import { CarRentalVehicleHistoryComponent } from './components/car-rental-current-vehicle-history/car-rental-current-vehicle-history.component';
import { CarRentalCurrentVehicleInfoComponent } from './components/car-rental-current-vehicle-info/car-rental-current-vehicle-info.component';
import { CarRentalDateInputComponent } from './components/car-rental-date-input/car-rental-date-input.component';
import { CarRentalSearchComponent } from './components/car-rental-search/car-rental-search.component';
import { CarTransactionDetailsComponent } from './components/car-transaction-details/car-transaction-details.component';
import { RentalComponent } from './rental.component';
import { CarRentalHistoryComponent } from './router-page/car-rental-history/car-rental-history.component';
import { CarRentalListComponent } from './router-page/car-rental-list/car-rental-list.component';

export const RentalDeclarations = [
  CarRentalBackButtonComponent,
  CarRentalCompanyDetailsComponent,
  CarRentalVehicleHistoryComponent,
  CarRentalCurrentVehicleInfoComponent,
  CarRentalDateInputComponent,
  CarRentalSearchComponent,
  CarTransactionDetailsComponent,
  RentalComponent,
  CarRentalHistoryComponent,
  CarRentalListComponent,
];

export const RentalProviders = [
  CarRentalService,
  RentalStorageService,
];
