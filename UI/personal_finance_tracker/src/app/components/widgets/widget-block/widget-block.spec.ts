import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetBlock } from './widget-block';

describe('WidgetBlock', () => {
  let component: WidgetBlock;
  let fixture: ComponentFixture<WidgetBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetBlock],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetBlock);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
