import { Component, Input } from '@angular/core';
import dayjs from 'dayjs/esm';
import { OutCarRentalInfoListSearch } from 'src/app/modules/vehicle-system/interfaces/car-rental/car-rental';

@Component({
  selector: 'vs-car-rental-current-vehicle-info',
  templateUrl: './car-rental-current-vehicle-info.component.html',
  styleUrls: ['./car-rental-current-vehicle-info.component.scss'],
})
export class CarRentalCurrentVehicleInfoComponent {
  @Input() currentCarRentalData!: OutCarRentalInfoListSearch;

  registrationDateFormat(): string {
    if (this.currentCarRentalData.registrationDate.includes('-')) {
      return this.currentCarRentalData.registrationDate;
    } else {
      return dayjs(Number(this.currentCarRentalData.registrationDate)).format('MMM D, YYYY h:mm A');
    }
  }

  registrationExpiryFormat(): string {
    if (this.currentCarRentalData.registrationExpiry.includes('-')) {
      return this.currentCarRentalData.registrationExpiry;
    } else {
      return dayjs(Number(this.currentCarRentalData.registrationExpiry)).format('MMM D, YYYY h:mm A');
    }
  }
}
