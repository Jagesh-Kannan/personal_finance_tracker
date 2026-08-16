import { Injectable } from '@angular/core';
import { EChartsOption } from 'echarts';
import { CHART_BASE_CONFIGS } from '../../helper/chartBase.config';


@Injectable({
  providedIn: 'root'
})
export class PieDataFormatterService {

  private  defaultGroupingKey = 'expenseCategory';
  private defaultValueKey = 'amount';

  generateOptions(params: ChartConfigParams): EChartsOption {
 
    const { 
      chartType, rawData, groupByKey = this.defaultGroupingKey, 
      valueByKey = this.defaultValueKey, currencySymbol = '₹', customSeriesProps = {} 
    } = params;

     const autoDimensions = rawData && rawData.length > 0 
      ? Object.keys(rawData[0]) 
      : [groupByKey, valueByKey];

    const baseConfig = JSON.parse(JSON.stringify(CHART_BASE_CONFIGS[chartType.toUpperCase()] || {}));

    const dataset = [
      { source: rawData, sourceHeader: true, dimensions: autoDimensions },
      {
        transform: [
          {
            type: 'ecSimpleTransform:aggregate',
            config: {
              fromDatasetIndex: 0,
              groupBy: groupByKey || 0,
              resultDimensions: [
                { from: groupByKey || 0, name: groupByKey || 0 },
                { from: valueByKey || 1, method: 'sum', name: `total_${valueByKey || 'Uncategorized'}`}
              ]
            }
          }
        ]
      }
    ];

    const encode = this.getEncodeConfig(chartType, groupByKey, `total_${valueByKey || 'Uncategorized'}`);

    const labelFormatter = (formatterParams: any) => {
      if (Array.isArray(formatterParams.value)) {
        const numericVal =  formatterParams.value[1].toFixed(2); // Index 1 targets aggregated sum metric cleanly
        const percentPrefix = formatterParams.percent ? `${formatterParams.percent}% ` : '';
        return `${currencySymbol}${numericVal}`;
      }
      return '';
    };

    const completedSeries = {
       ...baseConfig,
      label: {...baseConfig.label, formatter: labelFormatter},
      ...customSeriesProps,
      datasetIndex: 1,
      encode: encode
    };

    return {
      ...baseConfig,
      dataset,
      series: [completedSeries]
    } as EChartsOption;
  }

  private getEncodeConfig(chartType: string, groupByKey: string | undefined, resultValueKey: string | undefined) {
    return chartType === 'pie' 
      ? { itemName: groupByKey, value: resultValueKey }
      : { x: groupByKey, y: resultValueKey };
  }
}
