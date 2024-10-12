import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeofenceTaskSearchFormComponent } from './geofence-task-search-form.component';

describe('GeofenceTaskSearchFormComponent', () => {
  let component: GeofenceTaskSearchFormComponent;
  let fixture: ComponentFixture<GeofenceTaskSearchFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [GeofenceTaskSearchFormComponent]});
    fixture = TestBed.createComponent(GeofenceTaskSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
