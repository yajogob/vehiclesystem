import { Component, Input, OnChanges } from '@angular/core';
import { TimePeriod } from 'ngx-daterangepicker-material/daterangepicker.component';
import { VehicleDateInputComponent } from 'src/app/modules/vehicle-system/components/vehicle-date-input/vehicle-date-input.component';

@Component({
  selector: 'vs-car-rental-date-input',
  templateUrl: './car-rental-date-input.component.html',
  styleUrls: ['./car-rental-date-input.component.scss'],
})
export class CarRentalDateInputComponent extends VehicleDateInputComponent implements OnChanges {
  @Input() isSetDefaultDate!: number;
  override selected: TimePeriod | null = null; // Overwrite Parent Class

  override ngOnChanges(): void {
    if (this.isSetDefaultDate) {
      this.selected = null;
    }
  }
}
