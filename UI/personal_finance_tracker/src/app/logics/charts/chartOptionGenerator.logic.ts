import { inject, Injectable } from '@angular/core';
import { EChartsOption } from 'echarts';
import { PieDataFormatterService } from './pie.dataTransform.logic';
import { BarDataFormatterService } from './bar.dataTransform.logic';


@Injectable({
  providedIn: 'root'
})

export class ChartOptionGeneratorService {

    constructor(private pieDataFormatterService: PieDataFormatterService, private barDataFormatterService: BarDataFormatterService ){}

    generateOptions(params: ChartConfigParams): EChartsOption {
 
        switch (params.chartType) {
            case 'pie':
            case 'doughnut':
                return this.pieDataFormatterService.generateOptions(params);
            case 'bar':
            case 'line':
                return this.barDataFormatterService.generateOptions(params);
            default:
                return {} as EChartsOption;
        }
  
    }
}