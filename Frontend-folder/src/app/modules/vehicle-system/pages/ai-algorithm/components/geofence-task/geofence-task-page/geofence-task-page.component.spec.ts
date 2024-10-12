import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeofenceTaskPageComponent } from './geofence-task-page.component';

describe('GeofenceTaskPageComponent', () => {
  let component: GeofenceTaskPageComponent;
  let fixture: ComponentFixture<GeofenceTaskPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [GeofenceTaskPageComponent]});
    fixture = TestBed.createComponent(GeofenceTaskPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
