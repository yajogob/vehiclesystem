import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchButtonRendererComponent } from './switch-button-renderer.component';

describe('SwitchButtonComponent', () => {
  let component: SwitchButtonRendererComponent;
  let fixture: ComponentFixture<SwitchButtonRendererComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [SwitchButtonRendererComponent]});
    fixture = TestBed.createComponent(SwitchButtonRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
