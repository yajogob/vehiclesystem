import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertDetailComponent } from './alert-detail.component';

describe('AlertDetailComponent', () => {
  let component: AlertDetailComponent;
  let fixture: ComponentFixture<AlertDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [AlertDetailComponent]});
    fixture = TestBed.createComponent(AlertDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
