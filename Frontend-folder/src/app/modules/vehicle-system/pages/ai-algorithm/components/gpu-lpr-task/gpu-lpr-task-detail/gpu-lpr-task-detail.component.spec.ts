import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpuLprTaskDetailComponent } from './gpu-lpr-task-detail.component';

describe('GpuLprTaskDetailComponent', () => {
  let component: GpuLprTaskDetailComponent;
  let fixture: ComponentFixture<GpuLprTaskDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [GpuLprTaskDetailComponent]});
    fixture = TestBed.createComponent(GpuLprTaskDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
