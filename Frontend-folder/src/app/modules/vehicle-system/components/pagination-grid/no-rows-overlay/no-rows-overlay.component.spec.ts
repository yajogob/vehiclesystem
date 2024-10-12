import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NoRowsOverlayComponent} from './no-rows-overlay.component';

describe('NoRowsOverlayComponent', () => {
  let component: NoRowsOverlayComponent;
  let fixture: ComponentFixture<NoRowsOverlayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [NoRowsOverlayComponent]});
    fixture = TestBed.createComponent(NoRowsOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
