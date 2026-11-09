import { inject, Injectable } from '@angular/core';
import { EChartsOption } from 'echarts';
import { PieDataFormatterService } from './pie.dataTransform.logic';
import { BarDataFormatterService } from './bar.dataTransform.logic';


@Injectable({
  providedIn: 'root'
})

export class ChartOptionGeneratorService {

    constructor(private pieDataFormatterService: PieDataFormatterService, private barDataFormatterService: BarDataFormatterService ){
        this.initWINDOWtooltipClickListener();
    }

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

    private initWINDOWtooltipClickListener() {
        (window as any).tooltipClickHandler = (params: any, action: string) => {
            const data = Array.isArray(params) ? params.map((p: any) => p.data) : params.data
            console.log(params);
            
            switch (action){
                case 'details_popup':
                    // Handle the details popup action
                    console.log('Details popup action triggered with event:', data);
                    break;
                case 'another_action':
                    // Handle another action
                    console.log('Another action triggered with event:', data);
                    break;
                default:
                    console.warn('Unknown action:', action);
            }
        };
    }
}