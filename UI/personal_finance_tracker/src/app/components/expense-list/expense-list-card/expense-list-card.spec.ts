import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseListCard } from './expense-list-card';

describe('ExpenseListCard', () => {
  let component: ExpenseListCard;
  let fixture: ComponentFixture<ExpenseListCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseListCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseListCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
