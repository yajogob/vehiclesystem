import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FineDetailsModalContentComponent } from './fine-details-modal-content.component';

describe('FineDetailsModalContentComponent', () => {
  let component: FineDetailsModalContentComponent;
  let fixture: ComponentFixture<FineDetailsModalContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [FineDetailsModalContentComponent]});
    fixture = TestBed.createComponent(FineDetailsModalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
