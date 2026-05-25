import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideUpForm } from './slide-up-form';

describe('SlideUpForm', () => {
  let component: SlideUpForm;
  let fixture: ComponentFixture<SlideUpForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlideUpForm],
    }).compileComponents();

    fixture = TestBed.createComponent(SlideUpForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
