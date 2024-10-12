import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiAlgorithmComponent } from './ai-algorithm.component';

describe('AiAlgorthmComponent', () => {
  let component: AiAlgorithmComponent;
  let fixture: ComponentFixture<AiAlgorithmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [AiAlgorithmComponent]});
    fixture = TestBed.createComponent(AiAlgorithmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
