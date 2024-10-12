import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehavioralAlertComponent } from './behavioral-alert.component';

describe('BehavioralAlertComponent', () => {
  let component: BehavioralAlertComponent;
  let fixture: ComponentFixture<BehavioralAlertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [BehavioralAlertComponent]});
    fixture = TestBed.createComponent(BehavioralAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
