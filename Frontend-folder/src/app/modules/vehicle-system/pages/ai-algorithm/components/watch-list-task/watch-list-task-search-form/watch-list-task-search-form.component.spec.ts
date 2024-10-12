import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchListTaskSearchFormComponent } from './watch-list-task-search-form.component';

describe('WatchListTaskSearchFormComponent', () => {
  let component: WatchListTaskSearchFormComponent;
  let fixture: ComponentFixture<WatchListTaskSearchFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [WatchListTaskSearchFormComponent]});
    fixture = TestBed.createComponent(WatchListTaskSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
