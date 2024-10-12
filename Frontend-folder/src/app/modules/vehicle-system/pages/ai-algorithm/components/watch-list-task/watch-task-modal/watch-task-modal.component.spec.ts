import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchTaskModalComponent } from './watch-task-modal.component';

describe('CreateEditWatchTaskComponent', () => {
  let component: WatchTaskModalComponent;
  let fixture: ComponentFixture<WatchTaskModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [WatchTaskModalComponent]});
    fixture = TestBed.createComponent(WatchTaskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
