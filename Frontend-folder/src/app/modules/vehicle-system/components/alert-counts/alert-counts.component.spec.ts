import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertCountsComponent } from './alert-counts.component';

describe('AlertCountsComponent', () => {
  let component: AlertCountsComponent;
  let fixture: ComponentFixture<AlertCountsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [AlertCountsComponent]});
    fixture = TestBed.createComponent(AlertCountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
