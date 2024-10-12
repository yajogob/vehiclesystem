import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpuLprTaskSearchFormComponent } from './gpu-lpr-task-search-form.component';

describe('GpuLprTaskSearchFormComponent', () => {
  let component: GpuLprTaskSearchFormComponent;
  let fixture: ComponentFixture<GpuLprTaskSearchFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [GpuLprTaskSearchFormComponent]});
    fixture = TestBed.createComponent(GpuLprTaskSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
