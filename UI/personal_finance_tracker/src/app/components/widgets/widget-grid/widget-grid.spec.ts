import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetGrid } from './widget-grid';

describe('WidgetGrid', () => {
  let component: WidgetGrid;
  let fixture: ComponentFixture<WidgetGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetGrid],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
