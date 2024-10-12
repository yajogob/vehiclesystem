import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchListTaskDetailComponent } from './watch-list-task-detail.component';

describe('WatchListTaskDetailComponent', () => {
  let component: WatchListTaskDetailComponent;
  let fixture: ComponentFixture<WatchListTaskDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [WatchListTaskDetailComponent]});
    fixture = TestBed.createComponent(WatchListTaskDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
