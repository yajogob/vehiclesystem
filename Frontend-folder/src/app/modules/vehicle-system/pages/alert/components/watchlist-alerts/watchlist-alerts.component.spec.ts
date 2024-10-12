import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchlistAlertsComponent } from './watchlist-alerts.component';

describe('WatchlistAlertsComponent', () => {
  let component: WatchlistAlertsComponent;
  let fixture: ComponentFixture<WatchlistAlertsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [WatchlistAlertsComponent]});
    fixture = TestBed.createComponent(WatchlistAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
