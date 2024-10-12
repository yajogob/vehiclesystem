import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideVpSearchComponent } from './side-vp-search.component';

describe('SideVpSearchComponent', () => {
  let component: SideVpSearchComponent;
  let fixture: ComponentFixture<SideVpSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [SideVpSearchComponent]});
    fixture = TestBed.createComponent(SideVpSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
