import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarRentalBackButtonComponent } from './car-rental-back-button.component';

describe('CarRentalBackButtonComponent', () => {
  let component: CarRentalBackButtonComponent;
  let fixture: ComponentFixture<CarRentalBackButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [CarRentalBackButtonComponent]});
    fixture = TestBed.createComponent(CarRentalBackButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
