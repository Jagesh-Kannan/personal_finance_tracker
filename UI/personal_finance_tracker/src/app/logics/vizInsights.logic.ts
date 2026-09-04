import { Injectable } from "@angular/core";
import { AggrigateService } from "./aggrigate";

@Injectable({
  providedIn: 'root'
})
export class VizInsightsService {


      private readonly current_fullYear = new Date().getUTCFullYear();
            private monthMap = new Map<string, number>([
    ['jan', 0],
    ['feb', 1],
    ['mar', 2],
    ['apr', 3],
    ['may', 4],
    ['jun', 5],
    ['jul', 6],
    ['aug', 7],
    ['sep', 8],
    ['oct', 9],
    ['nov', 10],
    ['dec', 11],
  ]);

    constructor(private aggrigateService:AggrigateService){}

    private generateShortId(): string {
        const random4Digit = Math.floor(1000 + Math.random() * 9000);
        return `inzt_wdgt_${random4Digit}`;
    }


    public generate_vizInsightWidget_baseConfig(configs:VizWidgetBaseConfig[] = []) :WidgetDetails[]{
       return configs.map(d=>this.insightWidget_BaseConfig(d));
    }

    public insightWidget_BaseConfig(config:VizWidgetBaseConfig) : WidgetDetails{
        return {
            widgetId: this.generateShortId(),
            title: config.title,
            description: config.description || '',
            chartConfig: {
                rawData: [],
                chartType: config.chartType,
                xAxis: config.xAxis,
                yAxis: config.yAxis,
                groupByKey: config.groupByKey,
                valueByKey: config.valueByKey,
                customSeriesProps: config.options
            }
        };
    }

    public getMonthly_insightData(month: Months, expenses: ExpenseSchema[] ){
        const utcMonth: number =  this.monthMap.get(month) || 0 ;
       return this.aggrigateService.segregateMonthlyTransactions(expenses)[this.current_fullYear + '-' + utcMonth];
    }

    public generate_insightWidget_rawData(widgetId:string, rawData:any[]):{widgetId:string, rawData:any[]}{
        return {
            widgetId,
            rawData
        }
    }
}