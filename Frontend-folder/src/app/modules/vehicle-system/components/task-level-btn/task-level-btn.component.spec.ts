import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskLevelBtnComponent } from './task-level-btn.component';

describe('TaskLevelBtnComponent', () => {
  let component: TaskLevelBtnComponent;
  let fixture: ComponentFixture<TaskLevelBtnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [TaskLevelBtnComponent]});
    fixture = TestBed.createComponent(TaskLevelBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
