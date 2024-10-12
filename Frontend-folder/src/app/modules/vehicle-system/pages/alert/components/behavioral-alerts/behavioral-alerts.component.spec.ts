import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehavioralAlertsComponent } from './behavioral-alerts.component';

describe('BehavioralAlertsComponent', () => {
  let component: BehavioralAlertsComponent;
  let fixture: ComponentFixture<BehavioralAlertsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [BehavioralAlertsComponent]});
    fixture = TestBed.createComponent(BehavioralAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
