import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gridster } from './gridster';

describe('Gridster', () => {
  let component: Gridster;
  let fixture: ComponentFixture<Gridster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gridster],
    }).compileComponents();

    fixture = TestBed.createComponent(Gridster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
