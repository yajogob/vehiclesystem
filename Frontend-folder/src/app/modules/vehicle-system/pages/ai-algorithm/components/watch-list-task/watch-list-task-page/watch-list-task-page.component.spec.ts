import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchListTaskPageComponent } from './watch-list-task-page.component';

describe('WatchListTaskPageComponent', () => {
  let component: WatchListTaskPageComponent;
  let fixture: ComponentFixture<WatchListTaskPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [WatchListTaskPageComponent]});
    fixture = TestBed.createComponent(WatchListTaskPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
