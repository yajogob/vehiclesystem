import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraListComponent } from './camera-list.component';

describe('CameraListComponent', () => {
  let component: CameraListComponent;
  let fixture: ComponentFixture<CameraListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [CameraListComponent]});
    fixture = TestBed.createComponent(CameraListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
