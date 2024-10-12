import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FakePlateNoDatabaseTableComponent } from './fake-plate-no-database-table.component';

describe('FakePlateTableComponent', () => {
  let component: FakePlateNoDatabaseTableComponent;
  let fixture: ComponentFixture<FakePlateNoDatabaseTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [FakePlateNoDatabaseTableComponent]});
    fixture = TestBed.createComponent(FakePlateNoDatabaseTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
