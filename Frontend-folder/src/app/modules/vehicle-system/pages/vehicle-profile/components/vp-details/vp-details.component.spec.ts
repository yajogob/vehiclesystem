import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VpDetailsComponent } from './vp-details.component';

describe('VpDetailsComponent', () => {
  let component: VpDetailsComponent;
  let fixture: ComponentFixture<VpDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [VpDetailsComponent]});
    fixture = TestBed.createComponent(VpDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
