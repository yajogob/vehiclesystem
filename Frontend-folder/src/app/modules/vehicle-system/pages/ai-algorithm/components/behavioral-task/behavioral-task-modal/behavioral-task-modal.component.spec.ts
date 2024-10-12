import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehavioralTaskModalComponent } from './behavioral-task-modal.component';

describe('CreateEditBehavioralTaskComponent', () => {
  let component: BehavioralTaskModalComponent;
  let fixture: ComponentFixture<BehavioralTaskModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [BehavioralTaskModalComponent]});
    fixture = TestBed.createComponent(BehavioralTaskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
