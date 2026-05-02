import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, input, signal} from '@angular/core';
import { SkeletonLoader } from '../../skeleton-loader/skeleton-loader';
import { AbsolutePipe } from '../../custom-pipes/mathAbsolute';
import { SmartCurrencyPipe } from '../../custom-pipes/currency-converter';
import * as echarts from 'echarts';

@Component({
  selector: 'statistic-card',
  imports: [CommonModule, SkeletonLoader, AbsolutePipe, SmartCurrencyPipe],
  providers: [CurrencyPipe],
  templateUrl: './statistic-card.html',
  styleUrl: './statistic-card.css',
})
export class StatisticCard {

  public readonly statsUUID = signal<string>(this.generateShortId());
  private generateShortId(): string {
    // Generates a random 4-digit number between 1000 and 9999
    const random4Digit = Math.floor(1000 + Math.random() * 9000);
    return `stc_${random4Digit}`;
  }


  public statisticData = input.required<StatisticDetail>();
  public statisticCardLoader = input.required<boolean>();

  private sparkLineChart?: echarts.ECharts;

  
  ngAfterContentInit(){
    setTimeout(()=>{  
    const chartId = this.statsUUID() + '_sparkLine';
    const chartElement = document.getElementById(chartId);

    if (chartElement) {
      this.sparkLineChart = echarts.init(chartElement, null, { renderer: 'svg' });
      this.sparkLineChart.setOption(this.getOptions());
    }},0)
  
  }

  private getOptions() {

    let seriesArr:any[] = [];
    this.statisticData().note.forEach(d =>{

      const isPositive = d.sign === 'positive';
      const mainColor = isPositive ? 'var(--success-color)' : 'var(--error-color)';
      const areaColor = isPositive ? 'var(--success-gradient)' : 'var(--error-gradient)';
      const areaColorBottom = isPositive ? 'rgba(74, 222, 128, 0)' : 'rgba(217, 39, 39, 0)';

      const series:any = {
        data: d.graphData,
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { color: mainColor, width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: areaColor },
            { offset: 1, color: areaColorBottom }
          ])
        }
      }
      seriesArr.push(series);
    })

    
    return {
      animation: false, 
      grid: { left: 0, right: 0, top: 5, bottom: 0 },
      xAxis: { type: 'category', show: false, boundaryGap: false },
      yAxis: { type: 'value', show: false },
      series: seriesArr
    };
  }

  ngOnDestroy() {
    if (this.sparkLineChart) {
      this.sparkLineChart.dispose();
    }
  }


}
