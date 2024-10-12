import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SiteSelectorComponent } from './site-selector.component';

describe('SiteSelectorComponent', () => {
  let component: SiteSelectorComponent;
  let fixture: ComponentFixture<SiteSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [SiteSelectorComponent]});
    fixture = TestBed.createComponent(SiteSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
