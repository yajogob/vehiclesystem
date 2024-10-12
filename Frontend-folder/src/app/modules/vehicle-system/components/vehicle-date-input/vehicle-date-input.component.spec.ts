import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDateInputComponent } from './vehicle-date-input.component';

describe('VehicleDateInputComponent', () => {
  let component: VehicleDateInputComponent;
  let fixture: ComponentFixture<VehicleDateInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [VehicleDateInputComponent]});
    fixture = TestBed.createComponent(VehicleDateInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
