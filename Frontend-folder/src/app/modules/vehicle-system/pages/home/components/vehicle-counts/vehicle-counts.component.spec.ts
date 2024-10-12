import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleCountsComponent } from './vehicle-counts.component';

describe('VehicleCountsComponent', () => {
  let component: VehicleCountsComponent;
  let fixture: ComponentFixture<VehicleCountsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [VehicleCountsComponent]});
    fixture = TestBed.createComponent(VehicleCountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
