import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeofenceTaskModalComponent } from './geofence-task-modal.component';

describe('GeofenceTaskModalComponent', () => {
  let component: GeofenceTaskModalComponent;
  let fixture: ComponentFixture<GeofenceTaskModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [ GeofenceTaskModalComponent ]});
    fixture = TestBed.createComponent(GeofenceTaskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
