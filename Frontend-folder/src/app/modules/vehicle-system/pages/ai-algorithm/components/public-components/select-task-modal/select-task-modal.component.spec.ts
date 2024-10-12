import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTaskModalComponent } from './select-task-modal.component';

describe('SelectTaskModalComponent', () => {
  let component: SelectTaskModalComponent;
  let fixture: ComponentFixture<SelectTaskModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [SelectTaskModalComponent]});
    fixture = TestBed.createComponent(SelectTaskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
