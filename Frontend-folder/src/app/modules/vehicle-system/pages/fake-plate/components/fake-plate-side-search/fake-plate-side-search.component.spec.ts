import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FakePlateSideSearchComponent } from './fake-plate-side-search.component';

describe('FakePlateSideSearchComponent', () => {
  let component: FakePlateSideSearchComponent;
  let fixture: ComponentFixture<FakePlateSideSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [FakePlateSideSearchComponent]});
    fixture = TestBed.createComponent(FakePlateSideSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
