import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, input, Input, Signal, signal } from '@angular/core';
import { SkeletonLoader } from '../../skeleton-loader/skeleton-loader';
import { AbsolutePipe } from '../../custom-pipes/mathAbsolute';
import { SmartCurrencyPipe } from '../../custom-pipes/currency-converter';

@Component({
  selector: 'statistic-card',
  imports: [CommonModule, SkeletonLoader, AbsolutePipe, SmartCurrencyPipe],
  providers: [CurrencyPipe],
  templateUrl: './statistic-card.html',
  styleUrl: './statistic-card.css',
})
export class StatisticCard {
[x: string]: any;

  public statisticData = input.required<StatisticDetail>();
  public statisticCardLoader = input.required<boolean>();
}
