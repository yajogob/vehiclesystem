import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarRentalCurrentVehicleHistoryComponent } from './car-rental-current-vehicle-history.component';

describe('CarRentalCurrentVehicleHistoryComponent', () => {
  let component: CarRentalCurrentVehicleHistoryComponent;
  let fixture: ComponentFixture<CarRentalCurrentVehicleHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [CarRentalCurrentVehicleHistoryComponent]});
    fixture = TestBed.createComponent(CarRentalCurrentVehicleHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
