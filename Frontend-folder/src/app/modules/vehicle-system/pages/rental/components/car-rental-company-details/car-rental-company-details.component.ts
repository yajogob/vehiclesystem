import { Component, Input, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { OutCompanyDetailsData } from 'src/app/modules/vehicle-system/interfaces/car-rental/car-rental';
import { RentalConstLibrary } from '../../libs/rental-const-library';

@Component({
  selector: 'vs-car-rental-company-details',
  templateUrl: './car-rental-company-details.component.html',
  styleUrls: ['./car-rental-company-details.component.scss'],
})
export class CarRentalCompanyDetailsComponent implements OnInit {
  @Input() companyDetailsData!: OutCompanyDetailsData;

  activeLangValue = RentalConstLibrary.en;

  constructor(
    private translocoService: TranslocoService,
  ) {}

  ngOnInit(): void {
    this.activeLangValue = this.translocoService.getActiveLang();
  }

}
