import { createComponent, EnvironmentInjector, inject, Injectable, signal } from '@angular/core';
import { EChartsOption } from 'echarts';
import { PieDataFormatterService } from './pie.dataTransform.logic';
import { BarDataFormatterService } from './bar.dataTransform.logic';
import { DialogService } from '../../service/confirmation-dialog.service';
import { DetailsViewPopup } from '../../components/details-view-popup/details-view-popup';


@Injectable({
  providedIn: 'root'
})

export class ChartOptionGeneratorService {

    constructor(private pieDataFormatterService: PieDataFormatterService, private barDataFormatterService: BarDataFormatterService,
        private dialogService: DialogService, private environmentInjector: EnvironmentInjector
     ){
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
        (window as any).tooltipClickHandler = (data: {params: any, rawData: any, filteredBy: any}, action: string) => {
            const {params, rawData, filteredBy} = data;
            // const data = Array.isArray(params) ? params.map((p: any) => p.data) : params.data

            let seriesDetails: any[] = [];

            seriesDetails.push(...this.barDataFormatterService.barSeriesDetailsExtractor(data));
            //  seriesDetails.push(this.pieDataFormatterService.pieSeriesDetailsExtractor(data));     // not implimented yet
          
            switch (action){
                case 'details_popup':
                  
                    const elementRef = createComponent(DetailsViewPopup, {
                        environmentInjector: this.environmentInjector
                    });
                    elementRef.instance.data = seriesDetails;
                    elementRef.instance.type = 'ExpenseList';
                    this.dialogService.open({
                        title: 'Transactions - ' + ( params[0]?.axisType === "xAxis.time" ?  new Date(params[0]?.axisValue).toLocaleString('en-US', { month: 'long' })+ " " + new Date(params[0]?.axisValue).getDate() + "th" : 'Selected Category'),
                        template: elementRef.instance.detailsPopup,
                        templateContext: { $implicit: seriesDetails },
                    });
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