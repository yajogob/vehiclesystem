import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhiteListTaskDetailsTableComponent } from './white-list-task-details-table.component';

describe('WhiteListTaskDetailsTableComponent', () => {
  let component: WhiteListTaskDetailsTableComponent;
  let fixture: ComponentFixture<WhiteListTaskDetailsTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [WhiteListTaskDetailsTableComponent]});
    fixture = TestBed.createComponent(WhiteListTaskDetailsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
