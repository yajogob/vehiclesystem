import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewtaskComponent } from './create-newtask.component';

describe('CreateNewtaskComponent', () => {
  let component: CreateNewtaskComponent;
  let fixture: ComponentFixture<CreateNewtaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [CreateNewtaskComponent]});
    fixture = TestBed.createComponent(CreateNewtaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
