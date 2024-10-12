import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraManagementSearchComponent } from './camera-management-search.component';

describe('CameraManagementSearchComponent', () => {
  let component: CameraManagementSearchComponent;
  let fixture: ComponentFixture<CameraManagementSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [CameraManagementSearchComponent]});
    fixture = TestBed.createComponent(CameraManagementSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
