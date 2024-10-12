import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeofenceTaskDetailComponent } from './geofence-task-detail.component';

describe('GeofenceTaskDetailComponent', () => {
  let component: GeofenceTaskDetailComponent;
  let fixture: ComponentFixture<GeofenceTaskDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [GeofenceTaskDetailComponent]});
    fixture = TestBed.createComponent(GeofenceTaskDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
