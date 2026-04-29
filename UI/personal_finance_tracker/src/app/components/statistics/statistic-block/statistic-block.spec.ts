import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticBlock } from './statistic-block';

describe('StatisticBlock', () => {
  let component: StatisticBlock;
  let fixture: ComponentFixture<StatisticBlock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticBlock],
    }).compileComponents();

    fixture = TestBed.createComponent(StatisticBlock);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
