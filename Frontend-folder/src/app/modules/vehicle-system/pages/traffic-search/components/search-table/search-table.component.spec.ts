

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTableComponent } from './search-table.component';

describe('SearchTableComponent', () => {
  let component: SearchTableComponent;
  let fixture: ComponentFixture<SearchTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [SearchTableComponent]});
    fixture = TestBed.createComponent(SearchTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
