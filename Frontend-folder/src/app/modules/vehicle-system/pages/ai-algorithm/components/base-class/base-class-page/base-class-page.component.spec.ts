import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseClassPageComponent } from './base-class-page.component';

describe('BaseClassPageComponent', () => {
  let component: BaseClassPageComponent;
  let fixture: ComponentFixture<BaseClassPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [BaseClassPageComponent]});
    fixture = TestBed.createComponent(BaseClassPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
