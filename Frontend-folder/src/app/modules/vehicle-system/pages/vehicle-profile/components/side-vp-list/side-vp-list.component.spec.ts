import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideVpListComponent } from './side-vp-list.component';

describe('SideVpListComponent', () => {
  let component: SideVpListComponent;
  let fixture: ComponentFixture<SideVpListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [SideVpListComponent]});
    fixture = TestBed.createComponent(SideVpListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
