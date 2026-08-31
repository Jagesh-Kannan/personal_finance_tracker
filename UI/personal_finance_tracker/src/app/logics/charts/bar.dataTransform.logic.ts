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
        : [groupByKey, valueByKey, customSeriesProps?.['splitBy']?.param, customSeriesProps?.['stackBy']?.param, customSeriesProps?.['sortBy']?.param].filter(Boolean);

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

      if (!params || params.length === 0) return '';
  
    let result='';
     if ( params[0].axisType === "xAxis.time")  result= `<div style="font-weight:700; margin-bottom:5px;">Date: ${params[0].axisValueLabel}</div>`;
     else result =  `<div style="font-weight:700; margin-bottom:5px;">${params[0].axisValueLabel}</div>`;
      let totalSum = 0;

      params.forEach((item: any) => {
        if (!item.value) return;
        
        // Target index calculations safely against multi-dimensional array transformation outputs
        let val = 0;
        if (Array.isArray(item.value)) {
          const valIndex = item.dimensionNames ? item.dimensionNames.indexOf(`${valueByKey}`) : -1;
          val = parseFloat(item.value[valIndex !== -1 ? valIndex : 2]) || 0;
        } else {
          val = parseFloat(item.value[`${valueByKey}`]) || 0;
        }
        
        if (val > 0) {
         
          let labelName='';
          if(item.seriesName?.toLowerCase() === 'debited'){
            labelName='-';
            totalSum-=val
          }
          else if(item.seriesName?.toLowerCase() === 'credited'){
            labelName='+';
            totalSum+=val
          }
          else {
            labelName=item.seriesName+':';
             totalSum += val;
          }
          result += `<b style="color:${item.color}">${item.marker} ${labelName} <b>${currencySymbol}${val.toLocaleString('en-IN')}</b></b><br/>`;
        }
      });

      if ( params.length > 1) {
        result += `<div style="border-top:1px solid #e2e8f0; margin-top:5px; padding-top:5px; font-weight:700;">Total: ${currencySymbol}${totalSum.toLocaleString('en-IN')}</div>`;
      }
      return result;
    };

    const xAxisLabelFormatter = (formatterParams: any) => {
      if (formatterParams) {
        let date = new Date(formatterParams);
        if (date.toString() !== 'Invalid Date') return formatterParams;
        else if (typeof formatterParams === 'string'){
            return formatterParams.length > 8 ? formatterParams.slice(0, 8) + '...' : formatterParams;
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
        `${valueByKey || 'Uncategorized'}`,
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
           
            // {
            //   type: 'ecSimpleTransform:aggregate', // Uses the Manufac library hook
            //   config: {
            //     groupBy: groupByKey || 0,
            //     resultDimensions: [
            //       { from: groupByKey || 0, name: groupByKey || 0 },
            //       {
            //         from: valueByKey || 1,
            //         method: 'sum',
            //         name: `${valueByKey || 'Uncategorized'}`,
            //       },
            //     ],
            //   },
            //   //   print: true,
            // },
          ],
        };

        transformConfig.push(t);
      });
    }
    if (customTransformProps?.sortBy && customTransformProps?.sortBy.order){

     
      const t = { type: 'sort',
        config: { dimension: customTransformProps.sortBy.param , order:  customTransformProps.sortBy.order }
      };
    

      if(transformConfig.length > 0){
        transformConfig.forEach(d=> d.transform.unshift(t));
      }
      else{
        transformConfig.push(
          {
            fromDatasetIndex: 0,
            transform: [t]
          }
        )
      }
    }
    // if(customTransformProps?.stackBy && customTransformProps?.stackBy.param){

    // //   // return [];

    // // //       const stackParam = customTransformProps.stackBy.param;

    // // //        const groupByArray: (string | number)[] = [];

    // // //         groupByArray.push(groupByKey !== undefined ? groupByKey : 0);
    // // //          groupByArray.push(stackParam);

    // // //             const resultDimensions: any[] = [];

    // // //             resultDimensions.push({ 
    // // //             from: groupByKey !== undefined ? groupByKey : 0, 
    // // //             name: groupByKey !== undefined ? groupByKey : 0 
    // // //             });


    // // //             resultDimensions.push({ 
    // // //             from: stackParam, 
    // // //             name: stackParam 
    // // //             });

    // // //                 resultDimensions.push({ 
    // // //   from: valueByKey !== undefined ? valueByKey : 1, 
    // // //   method: 'sum', 
    // // //   name: `total_${valueByKey || 'Uncategorized'}` 
    // // // });



    // // //  const t = {
    // // //   transform: [
    // // //     {
    // // //       type: 'ecSimpleTransform:aggregate',
    // // //       config: {
    // // //         fromDatasetIndex: 0,
    // // //         // Passes the composite array template here cleanly
    // // //         groupBy: groupByKey, 
    // // //         resultDimensions: resultDimensions
    // // //       },
    // // //       print: true
    // // //     }
    // // //   ]
    // // // };

    //     const t = {
    //     transform: [
    //       {
    //         type: 'ecSimpleTransform:aggregate',
    //         config: {
    //           fromDatasetIndex: 0,
    //           groupBy: 0,
    //           resultDimensions: [
    //             { from: customTransformProps?.stackBy.param, name: customTransformProps?.stackBy.param},
    //             { from: groupByKey, name:  groupByKey },
    //             { from:  valueByKey, method: 'sum', name: `${valueByKey || 'Uncategorized'}`}
    //           ]
    //         },
    //         print: true
    //       }
    //     ]
    //   }

    //   transformConfig.push(t);
    // }
     if(groupByKey && valueByKey){
       const t = {
            type: 'ecSimpleTransform:aggregate',
            config: {
              // fromDatasetIndex: 0,
              groupBy: groupByKey || 0,
              resultDimensions: [
                { from: groupByKey || 0, name: groupByKey || 0 },
                { from: valueByKey || 1, method: 'sum', name: `${valueByKey || 'Uncategorized'}`}
              ]
            }
         }

      if(transformConfig.length > 0){
        transformConfig.forEach(d=> d.transform.push(t));
      }
      else{
        transformConfig.push(
          {
            fromDatasetIndex: 0,
            transform: [t]
          }
        )
      }
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
    if(tConfig.length > 0){
    return tConfig.map((config:any, index) => {
      return {
        name: config?.transform.filter((d:any)=>d.type==='filter').map((d:any)=>d.config.value)[0] || '',
        smooth: true,
        type: baseConfig.type,
        itemStyle:{color: this.resolveColor(customSeriesProps.splitBy?.color[index])},
        datasetIndex: index + 1,
        encode: this.getEncodeConfig(groupByKey, resultValueKey),
      };
    });
  }
  else if(customSeriesProps?.stackBy?.param){
     return tConfig.map((config:any, index) => {
       return config?.resultDimension.map((d:any, index:any)=>{
            return {
              name: config?.transform[0]?.config?.value || '',
               smooth: true,
              type: baseConfig.type,
              // itemStyle:{color: this.resolveColor(customSeriesProps.splitBy?.color[index])},
              datasetIndex:  1,
              encode: this.getEncodeConfig(groupByKey, resultValueKey),
            };
       })
    });
  }
  else{
    return {
        type: baseConfig.type,
         smooth: true,
        datasetIndex: 0,
        encode: this.getEncodeConfig(groupByKey, resultValueKey),
      };
  }
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
