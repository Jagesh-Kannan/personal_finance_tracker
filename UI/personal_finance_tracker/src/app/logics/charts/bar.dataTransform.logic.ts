import { Injectable } from '@angular/core';
import { EChartsOption, SeriesOption } from 'echarts';
import { CHART_BASE_CONFIGS } from '../../helper/chartBase.config';
import { DataTransformOption } from '@manufac/echarts-simple-transform/dist/types';

@Injectable({
  providedIn: 'root',
})
export class BarDataFormatterService {
  private defaultGroupingKey = 'expenseCategory';
  private defaultValueKey = 'amount';

  generateOptions(params: ChartConfigParams): EChartsOption {
    const {
      chartType,
      rawData,
      groupByKey = this.defaultGroupingKey,
      valueByKey = this.defaultValueKey,
      currencySymbol = '₹',
      customSeriesProps = {},
    } = params;

    const autoDimensions =
      rawData && rawData.length > 0
        ? Object.keys(rawData[0])
        : [groupByKey, valueByKey, customSeriesProps?.['splitBy']?.param].filter(Boolean);

    const baseConfig = JSON.parse(
      JSON.stringify(CHART_BASE_CONFIGS[chartType.toUpperCase()] || {}),
    );

    const transformConfig = this.generateTransfromConfig(groupByKey, valueByKey, customSeriesProps);

    const dataset = [
      {
        source: rawData,
        sourceHeader: true,
        dimensions: autoDimensions,
      },
      ...transformConfig,
    ];

    const labelFormatter = (formatterParams: any) => {
      if (!formatterParams || !formatterParams.value) return '';
      let date = new Date(formatterParams.value);
      if (date.toString() !== 'Invalid Date') {
        return `${new Date(formatterParams.value).toISOString().substring(0, 10)}`;
      }
      else if (typeof formatterParams.value === 'string'){
        return formatterParams.value;
      }
      return '';
    };

    const tooltipFormatter = (params: any) => {
      let result = `${params[0].axisValueLabel}<br/>`;
      params.forEach((item: any) => {
        result += `${item.marker}  ${currencySymbol}${item.value[item.encode.y[0]]}<br/>`;
      });
      return result;
    };

    const xAxisLabelFormatter = (formatterParams: any) => {
      if (formatterParams) {
        let date = new Date(formatterParams);
        if (date.toString() !== 'Invalid Date') return formatterParams;
        else if (typeof formatterParams === 'string'){
            return formatterParams.length > 10 ? formatterParams.slice(0, 10) + '...' : formatterParams;
        }
      }

      return formatterParams;
    };

    const yAxisLabelFormatter = (formatterParams: any) => {
      if (formatterParams) {
        if (typeof formatterParams === 'number') {
          const kilos = formatterParams / 1000;
          return `${currencySymbol}${kilos < 1 ? formatterParams : kilos + 'k'}`;
        }
      }

      return formatterParams;
    };

    const xAxisType = !isNaN(Date.parse(rawData[0]?.[groupByKey])) ? 'time' : 'category';

    return {
      ...baseConfig,
      xAxis: {
        ...baseConfig.xAxis,
        type: xAxisType,
        axisLabel: {
          ...baseConfig.xAxis?.axisLabel,
          formatter: xAxisType !== 'time' ? xAxisLabelFormatter : undefined,
        },
      },
      yAxis: {
        ...baseConfig.yAxis,
        axisLabel: { ...baseConfig.yAxis?.axisLabel, formatter: yAxisLabelFormatter },
      },
      label: { ...baseConfig.label, formatter: labelFormatter },
      tooltip: { ...baseConfig.tooltip, formatter: tooltipFormatter },
      dataset,
      series: this.generateSeries(
        baseConfig,
        customSeriesProps,
        groupByKey,
        `total_${valueByKey || 'Uncategorized'}`,
        transformConfig,
      ),
    } as EChartsOption;
  }

  private getEncodeConfig(groupByKey: string | undefined, resultValueKey: string | undefined) {
    return { x: groupByKey, y: resultValueKey };
  }

  private generateTransfromConfig(
    groupByKey: string | undefined,
    valueByKey: string | undefined,
    customTransformProps: any,
  ): DataTransformOption[] {
    let transformConfig: any[] = [];

    if (customTransformProps?.splitBy && customTransformProps?.splitBy.value) {
      customTransformProps.splitBy.value.forEach((val: any) => {
        const t = {
          fromDatasetIndex: 0,
          transform: [
            {
              type: 'filter',
              config: {
                dimension: customTransformProps.splitBy.param,
                value: val,
              },
              //   print: true,
            },
            {
              type: 'ecSimpleTransform:aggregate', // Uses the Manufac library hook
              config: {
                groupBy: groupByKey || 0,
                resultDimensions: [
                  { from: groupByKey || 0, name: groupByKey || 0 },
                  {
                    from: valueByKey || 1,
                    method: 'sum',
                    name: `total_${valueByKey || 'Uncategorized'}`,
                  },
                ],
              },
              //   print: true,
            },
          ],
        };

        transformConfig.push(t);
      });
    }
    else if(groupByKey && valueByKey){
       const t = {
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

      transformConfig.push(t);
    }

    return transformConfig;
  }

  private generateSeries(
    baseConfig: any,
    customSeriesProps:any,
    groupByKey: string | undefined,
    resultValueKey: string | undefined,
    tConfig: DataTransformOption[],
  ): SeriesOption | SeriesOption[] {
    return tConfig.map((config:any, index) => {
      return {
        name: config?.transform[0]?.config?.value || '',
        type: baseConfig.type,
        itemStyle:{color: this.resolveColor(customSeriesProps.splitBy?.color[index])},
        datasetIndex: index + 1,
        encode: this.getEncodeConfig(groupByKey, resultValueKey),
      };
    });
  }


 private resolveColor(variableName: string): string {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
    if (!value) {
      return variableName;
    }
    return value;
  };

}
