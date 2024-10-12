import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseClassSearchFormComponent } from './base-class-search-form.component';

describe('BaseClassSearchFormComponent', () => {
  let component: BaseClassSearchFormComponent;
  let fixture: ComponentFixture<BaseClassSearchFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [BaseClassSearchFormComponent]});
    fixture = TestBed.createComponent(BaseClassSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
