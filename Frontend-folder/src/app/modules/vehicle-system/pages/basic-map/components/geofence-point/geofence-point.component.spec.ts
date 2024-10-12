import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeofencePointComponent } from './geofence-point.component';

describe('GeofencePointComponent', () => {
  let component: GeofencePointComponent;
  let fixture: ComponentFixture<GeofencePointComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [GeofencePointComponent]});
    fixture = TestBed.createComponent(GeofencePointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
