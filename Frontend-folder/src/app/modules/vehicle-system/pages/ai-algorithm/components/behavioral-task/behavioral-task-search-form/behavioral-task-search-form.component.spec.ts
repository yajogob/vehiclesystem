import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehavioralTaskSearchFormComponent } from './behavioral-task-search-form.component';

describe('BehavioralTaskSearchFormComponent', () => {
  let component: BehavioralTaskSearchFormComponent;
  let fixture: ComponentFixture<BehavioralTaskSearchFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [BehavioralTaskSearchFormComponent]});
    fixture = TestBed.createComponent(BehavioralTaskSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
