import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardViewPublicComponent } from './card-view-public.component';

describe('CardViewPublicComponent', () => {
  let component: CardViewPublicComponent;
  let fixture: ComponentFixture<CardViewPublicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [CardViewPublicComponent]});
    fixture = TestBed.createComponent(CardViewPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
