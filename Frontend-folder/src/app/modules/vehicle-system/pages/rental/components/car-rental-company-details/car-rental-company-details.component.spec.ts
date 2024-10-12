import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarRentalCompanyDetailsComponent } from './car-rental-company-details.component';

describe('CarRentalCompanyDetailsComponent', () => {
  let component: CarRentalCompanyDetailsComponent;
  let fixture: ComponentFixture<CarRentalCompanyDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [CarRentalCompanyDetailsComponent]});
    fixture = TestBed.createComponent(CarRentalCompanyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
