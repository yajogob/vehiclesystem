import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarRentalDateInputComponent } from './car-rental-date-input.component';

describe('CarRentalDateInputComponent', () => {
  let component: CarRentalDateInputComponent;
  let fixture: ComponentFixture<CarRentalDateInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [CarRentalDateInputComponent]});
    fixture = TestBed.createComponent(CarRentalDateInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
