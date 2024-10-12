import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableActionsRendererComponent } from './table-actions-renderer.component';

describe('TableActionsRendererComponent', () => {
  let component: TableActionsRendererComponent;
  let fixture: ComponentFixture<TableActionsRendererComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [TableActionsRendererComponent]});
    fixture = TestBed.createComponent(TableActionsRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
