import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FakePlateNoDatabaseComponent } from './fake-plate-no-database.component';

describe('SideVpListComponent', () => {
  let component: FakePlateNoDatabaseComponent;
  let fixture: ComponentFixture<FakePlateNoDatabaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [FakePlateNoDatabaseComponent]});
    fixture = TestBed.createComponent(FakePlateNoDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
