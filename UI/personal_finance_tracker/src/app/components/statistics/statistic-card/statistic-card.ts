import { CommonModule } from '@angular/common';
import { Component, input, Input, Signal, signal } from '@angular/core';
import { SkeletonLoader } from '../../skeleton-loader/skeleton-loader';

@Component({
  selector: 'statistic-card',
  imports: [CommonModule, SkeletonLoader],
  templateUrl: './statistic-card.html',
  styleUrl: './statistic-card.css',
})
export class StatisticCard {

  public statisticData = input.required<StatisticDetail>();
  public statisticCardLoader = input.required<boolean>();
}
