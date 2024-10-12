import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraDetailsSideComponent } from './camera-details-side.component';

describe('CameraDetailsSideComponent', () => {
  let component: CameraDetailsSideComponent;
  let fixture: ComponentFixture<CameraDetailsSideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [CameraDetailsSideComponent]});
    fixture = TestBed.createComponent(CameraDetailsSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
