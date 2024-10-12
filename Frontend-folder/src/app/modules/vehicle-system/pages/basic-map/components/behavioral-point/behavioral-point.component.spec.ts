import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehavioralPointComponent } from './behavioral-point.component';

describe('BehavioralPointComponent', () => {
  let component: BehavioralPointComponent;
  let fixture: ComponentFixture<BehavioralPointComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [BehavioralPointComponent]});
    fixture = TestBed.createComponent(BehavioralPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
