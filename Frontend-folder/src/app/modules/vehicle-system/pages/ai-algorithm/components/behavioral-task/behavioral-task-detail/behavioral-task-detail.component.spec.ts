import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehavioralTaskDetailComponent } from './behavioral-task-detail.component';

describe('BehavioralTaskDetailComponent', () => {
  let component: BehavioralTaskDetailComponent;
  let fixture: ComponentFixture<BehavioralTaskDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [BehavioralTaskDetailComponent]});
    fixture = TestBed.createComponent(BehavioralTaskDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
