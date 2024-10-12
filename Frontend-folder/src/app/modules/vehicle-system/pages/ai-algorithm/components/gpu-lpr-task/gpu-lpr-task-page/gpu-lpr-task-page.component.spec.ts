import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpuLprTaskPageComponent } from './gpu-lpr-task-page.component';

describe('GpuLprTaskPageComponent', () => {
  let component: GpuLprTaskPageComponent;
  let fixture: ComponentFixture<GpuLprTaskPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [GpuLprTaskPageComponent]});
    fixture = TestBed.createComponent(GpuLprTaskPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
