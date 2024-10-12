import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopAlarmComponent } from './top-alarm.component';

describe('TopAlarmComponent', () => {
  let component: TopAlarmComponent;
  let fixture: ComponentFixture<TopAlarmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [TopAlarmComponent]});
    fixture = TestBed.createComponent(TopAlarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
