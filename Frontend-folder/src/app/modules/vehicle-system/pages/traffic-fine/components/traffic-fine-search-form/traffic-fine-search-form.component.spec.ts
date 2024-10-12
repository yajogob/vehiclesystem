import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficFineSearchFormComponent } from './traffic-fine-search-form.component';

describe('SearchFormComponent', () => {
  let component: TrafficFineSearchFormComponent;
  let fixture: ComponentFixture<TrafficFineSearchFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [TrafficFineSearchFormComponent]});
    fixture = TestBed.createComponent(TrafficFineSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
