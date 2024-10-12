import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GomapComponent } from './gomap.component';

describe('GomapComponent', () => {
  let component: GomapComponent;
  let fixture: ComponentFixture<GomapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [GomapComponent]});
    fixture = TestBed.createComponent(GomapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
