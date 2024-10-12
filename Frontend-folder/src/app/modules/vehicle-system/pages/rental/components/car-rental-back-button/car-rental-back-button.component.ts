import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'vs-car-rental-back-button',
  templateUrl: './car-rental-back-button.component.html',
  styleUrls: ['./car-rental-back-button.component.scss'],
})
export class CarRentalBackButtonComponent {
  @Input() backButtonText!: string;

  constructor(
    private location: Location,
  ) {}

  goBack = (): void => {
    this.location.historyGo(-1);
  };
}
