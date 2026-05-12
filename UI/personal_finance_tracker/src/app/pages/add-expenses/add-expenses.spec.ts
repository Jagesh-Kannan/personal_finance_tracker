import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExpenses } from './add-expenses';

describe('AddExpenses', () => {
  let component: AddExpenses;
  let fixture: ComponentFixture<AddExpenses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddExpenses],
    }).compileComponents();

    fixture = TestBed.createComponent(AddExpenses);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
