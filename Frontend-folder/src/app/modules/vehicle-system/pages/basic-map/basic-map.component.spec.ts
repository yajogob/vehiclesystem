import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicMapComponent } from './basic-map.component';

describe('BasicMapComponent', () => {
  let component: BasicMapComponent;
  let fixture: ComponentFixture<BasicMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [BasicMapComponent]});
    fixture = TestBed.createComponent(BasicMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
