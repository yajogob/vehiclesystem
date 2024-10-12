import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehavioralTaskPageComponent } from './behavioral-task-page.component';

describe('BehavioralTaskPageComponent', () => {
  let component: BehavioralTaskPageComponent;
  let fixture: ComponentFixture<BehavioralTaskPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [BehavioralTaskPageComponent]});
    fixture = TestBed.createComponent(BehavioralTaskPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
