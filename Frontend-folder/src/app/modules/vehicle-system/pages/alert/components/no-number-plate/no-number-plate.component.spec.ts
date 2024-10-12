import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoNumberPlateComponent } from './no-number-plate.component';

describe('NoNumberPlateComponent', () => {
  let component: NoNumberPlateComponent;
  let fixture: ComponentFixture<NoNumberPlateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [NoNumberPlateComponent]});
    fixture = TestBed.createComponent(NoNumberPlateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
