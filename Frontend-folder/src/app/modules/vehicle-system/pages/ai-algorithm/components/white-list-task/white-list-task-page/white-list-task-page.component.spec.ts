import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhiteListTaskComponent } from './white-list-task-page.component';

describe('WhiteListTaskComponent', () => {
  let component: WhiteListTaskComponent;
  let fixture: ComponentFixture<WhiteListTaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [WhiteListTaskComponent]});
    fixture = TestBed.createComponent(WhiteListTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
