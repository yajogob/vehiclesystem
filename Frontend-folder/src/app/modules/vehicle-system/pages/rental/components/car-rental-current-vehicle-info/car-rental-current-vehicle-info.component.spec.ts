import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarRentalCurrentVehicleInfoComponent } from './car-rental-current-vehicle-info.component';

describe('CarRentalCurrentVehicleInfoComponent', () => {
  let component: CarRentalCurrentVehicleInfoComponent;
  let fixture: ComponentFixture<CarRentalCurrentVehicleInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [CarRentalCurrentVehicleInfoComponent]});
    fixture = TestBed.createComponent(CarRentalCurrentVehicleInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
