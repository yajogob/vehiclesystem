import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VpTimeLineComponent } from './vp-time-line.component';

describe('VpTimeLineComponent', () => {
  let component: VpTimeLineComponent;
  let fixture: ComponentFixture<VpTimeLineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [VpTimeLineComponent]});
    fixture = TestBed.createComponent(VpTimeLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
