import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchlistPointComponent } from './watchlist-point.component';

describe('WatchlistPointComponent', () => {
  let component: WatchlistPointComponent;
  let fixture: ComponentFixture<WatchlistPointComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [WatchlistPointComponent]});
    fixture = TestBed.createComponent(WatchlistPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
