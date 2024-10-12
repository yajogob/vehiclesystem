import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ColumnPanelComponent} from './column-panel.component';

describe('ColumnPanelComponent', () => {
  let component: ColumnPanelComponent;
  let fixture: ComponentFixture<ColumnPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [ColumnPanelComponent]});
    fixture = TestBed.createComponent(ColumnPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
