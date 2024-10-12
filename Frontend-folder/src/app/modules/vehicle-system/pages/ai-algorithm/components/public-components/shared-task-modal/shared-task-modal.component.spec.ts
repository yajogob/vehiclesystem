import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTaskModalComponent } from './shared-task-modal.component';

describe('SharedTaskModalComponent', () => {
  let component: SharedTaskModalComponent;
  let fixture: ComponentFixture<SharedTaskModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [SharedTaskModalComponent]});
    fixture = TestBed.createComponent(SharedTaskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
