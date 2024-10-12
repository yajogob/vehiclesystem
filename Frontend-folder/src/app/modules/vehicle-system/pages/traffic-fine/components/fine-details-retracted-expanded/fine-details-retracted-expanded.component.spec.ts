import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FineDetailsRetractedExpandedComponent } from './fine-details-retracted-expanded.component';

describe('FineDetailsNotExpandedComponent', () => {
  let component: FineDetailsRetractedExpandedComponent;
  let fixture: ComponentFixture<FineDetailsRetractedExpandedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [FineDetailsRetractedExpandedComponent]});
    fixture = TestBed.createComponent(FineDetailsRetractedExpandedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
