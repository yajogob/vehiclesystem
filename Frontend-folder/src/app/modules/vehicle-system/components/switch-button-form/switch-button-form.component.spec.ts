import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchButtonFormComponent } from './switch-button-form.component';

describe('SwitchButtonFormComponent', () => {
  let component: SwitchButtonFormComponent;
  let fixture: ComponentFixture<SwitchButtonFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [SwitchButtonFormComponent]});
    fixture = TestBed.createComponent(SwitchButtonFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
