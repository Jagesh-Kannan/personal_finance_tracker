import { EChartsOption } from 'echarts';

export const CHART_BASE_CONFIGS: Record<string, Partial<EChartsOption>> = {
    PIE: {
        tooltip: { trigger: 'item' },
        legend: {
            left: 'right',
            orient: 'horizontal',
            textStyle: { fontWeight: 500, color: '#8a8c8f' }
        },
        labelLine: {
            show: true,
            // length: 3,
            // length2: 3,
            smooth: true,
            lineStyle: { width: 1.5, color: '#cbd5e1' }
        },
        itemStyle: {
            borderRadius: 5,
            borderColor: '#fff',
            borderWidth: 2
        },
        media: [
            {
                query: { maxWidth: 640 },
                option: {
                    legend:{
                        bottom: '-4%',
                        itemWidth: 10,
                        itemHeight: 10,
                        textStyle:{
                           fontSize: 7, 
                        }
                    },
                    itemStyle:{
                        borderRadius: 5,
                    },
                    series: [
                        { 
                            radius: ['30%', '50%'], 
                            label: { 
                                fontSize: 8 
                            } 
                        }
                    ]
                }
            }
        ]
    },
    BAR: {
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category' },
        yAxis: { type: 'value' }
    },
    LINE: {
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', boundaryGap: false },
        yAxis: { type: 'value' }
    }
};
