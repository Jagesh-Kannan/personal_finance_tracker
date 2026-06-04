import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseListContainer } from './expense-list-container';

describe('ExpenseListContainer', () => {
  let component: ExpenseListContainer;
  let fixture: ComponentFixture<ExpenseListContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseListContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseListContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
