import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseClassModalComponent } from './base-class-modal.component';

describe('BaseClassModalComponent', () => {
  let component: BaseClassModalComponent;
  let fixture: ComponentFixture<BaseClassModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [BaseClassModalComponent]});
    fixture = TestBed.createComponent(BaseClassModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
