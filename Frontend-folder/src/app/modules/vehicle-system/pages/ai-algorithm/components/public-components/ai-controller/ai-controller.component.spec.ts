import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiControllerComponent } from './ai-controller.component';

describe('AiControllerComponent', () => {
  let component: AiControllerComponent;
  let fixture: ComponentFixture<AiControllerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [AiControllerComponent]});
    fixture = TestBed.createComponent(AiControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
