import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarTransactionDetailsComponent } from './car-transaction-details.component';

describe('CarTransactionDetailsComponent', () => {
  let component: CarTransactionDetailsComponent;
  let fixture: ComponentFixture<CarTransactionDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [CarTransactionDetailsComponent]});
    fixture = TestBed.createComponent(CarTransactionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
