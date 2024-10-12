import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarRentalHistoryComponent } from './car-rental-history.component';

describe('CarRentalHistoryComponent', () => {
  let component: CarRentalHistoryComponent;
  let fixture: ComponentFixture<CarRentalHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [CarRentalHistoryComponent]});
    fixture = TestBed.createComponent(CarRentalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
