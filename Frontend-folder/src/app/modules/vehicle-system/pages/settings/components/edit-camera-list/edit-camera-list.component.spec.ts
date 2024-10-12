import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCameraListComponent } from './edit-camera-list.component';

describe('EditCameraListComponent', () => {
  let component: EditCameraListComponent;
  let fixture: ComponentFixture<EditCameraListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [EditCameraListComponent]});
    fixture = TestBed.createComponent(EditCameraListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
