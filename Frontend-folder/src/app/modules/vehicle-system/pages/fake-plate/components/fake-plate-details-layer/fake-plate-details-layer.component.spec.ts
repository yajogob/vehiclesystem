import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FakePlateDetailsLayerComponent } from './fake-plate-details-layer.component';

describe('FakePlateDetailsLayerComponent', () => {
  let component: FakePlateDetailsLayerComponent;
  let fixture: ComponentFixture<FakePlateDetailsLayerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [FakePlateDetailsLayerComponent]});
    fixture = TestBed.createComponent(FakePlateDetailsLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
