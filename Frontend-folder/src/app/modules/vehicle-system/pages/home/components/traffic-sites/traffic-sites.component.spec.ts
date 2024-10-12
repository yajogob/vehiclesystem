import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficSitesComponent } from './traffic-sites.component';

describe('TrafficSitesComponent', () => {
  let component: TrafficSitesComponent;
  let fixture: ComponentFixture<TrafficSitesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [TrafficSitesComponent]});
    fixture = TestBed.createComponent(TrafficSitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
