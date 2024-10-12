import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhiteTaskModalComponent } from './white-task-modal.component';

describe('AddEditWhiteTaskComponent', () => {
  let component: WhiteTaskModalComponent;
  let fixture: ComponentFixture<WhiteTaskModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [WhiteTaskModalComponent]});
    fixture = TestBed.createComponent(WhiteTaskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
