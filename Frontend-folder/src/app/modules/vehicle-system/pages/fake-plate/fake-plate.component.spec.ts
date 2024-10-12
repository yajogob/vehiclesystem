import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FakePlateComponent } from './fake-plate.component';

describe('FakePlateComponent', () => {
  let component: FakePlateComponent;
  let fixture: ComponentFixture<FakePlateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [FakePlateComponent]});
    fixture = TestBed.createComponent(FakePlateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
