import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficSearchComponent } from './traffic-search.component';

describe('TrafficSearchComponent', () => {
  let component: TrafficSearchComponent;
  let fixture: ComponentFixture<TrafficSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [TrafficSearchComponent]});
    fixture = TestBed.createComponent(TrafficSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
