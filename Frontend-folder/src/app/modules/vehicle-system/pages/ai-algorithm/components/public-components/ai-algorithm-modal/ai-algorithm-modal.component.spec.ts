import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiAlgorithmModalComponent } from './ai-algorithm-modal.component';

describe('AiAlgorithmModalComponent', () => {
  let component: AiAlgorithmModalComponent;
  let fixture: ComponentFixture<AiAlgorithmModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [AiAlgorithmModalComponent]});
    fixture = TestBed.createComponent(AiAlgorithmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
