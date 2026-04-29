import { CommonModule } from '@angular/common';
import { Component, input, Input, Signal, signal } from '@angular/core';

@Component({
  selector: 'statistic-card',
  imports: [CommonModule],
  templateUrl: './statistic-card.html',
  styleUrl: './statistic-card.css',
})
export class StatisticCard {

  public statisticData = input.required<StatisticDetail>();
}
