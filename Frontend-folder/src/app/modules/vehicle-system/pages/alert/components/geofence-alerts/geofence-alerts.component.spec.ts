import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeofenceAlertsComponent } from './geofence-alerts.component';

describe('GeofenceAlertsComponent', () => {
  let component: GeofenceAlertsComponent;
  let fixture: ComponentFixture<GeofenceAlertsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [GeofenceAlertsComponent]});
    fixture = TestBed.createComponent(GeofenceAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
