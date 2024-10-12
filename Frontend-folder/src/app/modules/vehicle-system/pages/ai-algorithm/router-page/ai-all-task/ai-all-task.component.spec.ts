import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiAllTaskComponent } from './ai-all-task.component';

describe('AiAllTaskComponent', () => {
  let component: AiAllTaskComponent;
  let fixture: ComponentFixture<AiAllTaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [AiAllTaskComponent]});
    fixture = TestBed.createComponent(AiAllTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
