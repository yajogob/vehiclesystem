import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FakePlateTableComponent } from './fake-plate-table.component';

describe('FakePlateTableComponent', () => {
  let component: FakePlateTableComponent;
  let fixture: ComponentFixture<FakePlateTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [FakePlateTableComponent]});
    fixture = TestBed.createComponent(FakePlateTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
