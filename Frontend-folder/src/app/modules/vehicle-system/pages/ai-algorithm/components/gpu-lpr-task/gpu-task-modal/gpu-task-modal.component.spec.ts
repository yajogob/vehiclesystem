import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpuTaskModalComponent } from './gpu-task-modal.component';

describe('CreateEditGpuLprTaskComponent', () => {
  let component: GpuTaskModalComponent;
  let fixture: ComponentFixture<GpuTaskModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [GpuTaskModalComponent]});
    fixture = TestBed.createComponent(GpuTaskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
