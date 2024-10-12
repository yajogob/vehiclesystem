import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertTableModalComponent } from './alert-table-modal.component';

describe('AlertTableModalComponent', () => {
  let component: AlertTableModalComponent;
  let fixture: ComponentFixture<AlertTableModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [AlertTableModalComponent]});
    fixture = TestBed.createComponent(AlertTableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
