import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FineDetailsComponent } from './fine-details.component';

describe('FineDetailsComponent', () => {
  let component: FineDetailsComponent;
  let fixture: ComponentFixture<FineDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [FineDetailsComponent]});
    fixture = TestBed.createComponent(FineDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
