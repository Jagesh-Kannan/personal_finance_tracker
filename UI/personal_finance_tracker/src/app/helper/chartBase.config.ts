import { EChartsOption } from 'echarts';

export const CHART_BASE_CONFIGS: Record<string, Partial<EChartsOption>> = {
  PIE: {
    type: 'pie',
    radius: '80%',
    center: ['50%', '50%'],
    avoidLabelOverlap: true,
    // padAngle: 4,
    tooltip: {
        show:true,
      trigger: 'item',
      appendToBody: true,
      extraCssText: "z-index: 9999;", 
      triggerOn: 'mousemove|click',                                  
      alwaysShowContent: false,                            
      confine: true               
    },
    legend: {
      type: 'scroll',
      left: 'right',
      orient: 'horizontal',
      textStyle: { fontWeight: 500, color: '#8a8c8f' },
    },
    label: {
      show: true,
      position: 'outside',
      fontSize: 6,
      fontWeight: 600,
      overflow: 'break',
    },
    labelLine: {
      show: true,
      // length: 3,
      // length2: 3,
      smooth: true,
      lineStyle: { width: 1.5, color: '#cbd5e1' },
    },
    itemStyle: {
      borderRadius: 5,
      borderColor: '#fff',
      borderWidth: 1,
    },
    media: [
      {
        query: { maxWidth: 640 },
        option: {
          legend: {
            bottom: '-5',
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
              fontSize: 7,
            },
          },
          itemStyle: {
            borderRadius: 5,
          },
          series: [
            {
              radius: '55%',
              label: {
                fontSize: 8,
              },
            },
          ],
        },
      },
    ],
  },
  DOUGHNUT: {
    type: 'pie',
    radius: ['45%', '70%'],
    center: ['50%', '50%'],
    avoidLabelOverlap: true,
    padAngle: 4,
    tooltip: {
      trigger: 'item',
      appendToBody: true,
      extraCssText: "z-index: 9999;", 
      triggerOn: 'click',                                  
      alwaysShowContent: false,                            
      confine: true               
    },
    legend: {
      type: 'scroll',
      left: 'right',
      orient: 'horizontal',
      textStyle: { fontWeight: 500, color: '#8a8c8f' },
    },
    label: {
      show: true,
      position: 'outside',
      fontSize: 6,
      fontWeight: 600,
      overflow: 'break',
    },
    labelLine: {
      show: true,
      // length: 3,
      // length2: 3,
      smooth: true,
      lineStyle: { width: 1.5, color: '#cbd5e1' },
    },
    itemStyle: {
      borderRadius: 5,
      borderColor: '#fff',
      borderWidth: 2,
    },
    media: [
      {
        query: { maxWidth: 640 },
        option: {
          legend: {
            bottom: '-5',
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
              fontSize: 7,
            },
          },
          itemStyle: {
            borderRadius: 5,
          },
          series: [
            {
              radius: ['40%', '70%'],
              label: {
                fontSize: 8,
              },
            },
          ],
        },
      },
    ],
  },
  BAR: {
    type: 'bar',
    //  center: ['50%', '50%'],
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      appendToBody: true,
      extraCssText: 'z-index: 9999;',
    },
    grid: { left: '9%', right: '4%', top: '10%', bottom: '10%' },
    xAxis: {
      type: 'category',
      axisLabel: {
        rotate: 45,
        fontWeight: 500,
      },
    },
    yAxis: { type: 'value', splitNumber: 10 },
    legend: {
      type: 'scroll',
      left: 'right',
      orient: 'horizontal',
      textStyle: { fontWeight: 500, color: '#8a8c8f' },
    },
    dataZoom: [
        {
            type: 'slider', 
            yAxisIndex: 0,  
            start: 0,      
        },
        {
            type: 'inside',
            yAxisIndex: 0,
        }
    ],
    media: [
      {
        query: { maxWidth: 640 },
        option: {
          grid: { left: '12%', bottom: '25' },
          xAxis: {
            axisLabel: {
              fontSize: 7,
            },
          },
          yAxis: {
            axisLabel: {
              fontSize: 7,
            },
          },
          legend: {
            bottom: '-8',
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
              fontSize: 7,
            },
          },
         dataZoom:[
            {
              type: 'slider', 
              show: false
            }
         ],
          series: [
            {
              label: {
                fontSize: 8,
              },
            },
          ],
        },
      },
    ],
  },
  LINE: {
    type: 'line',
      tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      appendToBody: true,
      extraCssText: 'z-index: 9999;',
    },
     grid: { left: '9%', right: '4%', top: '10%', bottom: '10%' },
     legend: {
      type: 'scroll',
      left: 'right',
      orient: 'horizontal',
      textStyle: { fontWeight: 500, color: '#8a8c8f' },
    },
    xAxis: { type: 'category', boundaryGap: false },
    yAxis: { type: 'value' },
     media: [
      {
        query: { maxWidth: 640 },
        option: {
          grid: { left: '12%', bottom: '25' },
          xAxis: {
            axisLabel: {
              fontSize: 7,
            },
          },
          yAxis: {
            axisLabel: {
              fontSize: 7,
            },
          },
          legend: {
            bottom: '-8',
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
              fontSize: 7,
            },
          },

          series: [
            {
              label: {
                fontSize: 8,
              },
            },
          ],
        },
      },
    ],
  },
};
