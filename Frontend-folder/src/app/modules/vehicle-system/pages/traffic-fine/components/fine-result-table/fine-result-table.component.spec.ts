import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FineResultTableComponent } from './fine-result-table.component';

describe('FineResultTableComponent', () => {
  let component: FineResultTableComponent;
  let fixture: ComponentFixture<FineResultTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [FineResultTableComponent]});
    fixture = TestBed.createComponent(FineResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
