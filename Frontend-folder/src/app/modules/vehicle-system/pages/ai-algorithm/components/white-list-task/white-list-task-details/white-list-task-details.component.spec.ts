import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhiteListTaskDetailsComponent } from './white-list-task-details.component';

describe('WhiteListTaskDetailsComponent', () => {
  let component: WhiteListTaskDetailsComponent;
  let fixture: ComponentFixture<WhiteListTaskDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [WhiteListTaskDetailsComponent]});
    fixture = TestBed.createComponent(WhiteListTaskDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
