import { Component, ElementRef, Input, SimpleChanges, viewChild, NgZone, inject } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-widget',
  imports: [],
  templateUrl: './widget.html',
  styleUrl: './widget.css',
  standalone: true
})
export class Widget {

  @Input() widgetDetails: any[] = [];

  pieContainer = viewChild<ElementRef>('pieContainer');
  private pieChart?: echarts.ECharts;
  private ngZone = inject(NgZone);
  private resizeListener?: () => void;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['widgetDetails'] && this.widgetDetails) {
      // Safely schedule an option update if the chart instance is already ready
      this.updateCharts(this.widgetDetails);
    }
  }

  ngAfterViewInit() {
    const container = this.pieContainer()?.nativeElement;
    if (!container) return;

    // Run ECharts outside Angular's zone to prevent unnecessary change detection cycles (helps performance on mobile)
    this.ngZone.runOutsideAngular(() => {
      this.pieChart = echarts.init(container, null, {
        renderer: 'canvas',
        devicePixelRatio: Math.min(window.devicePixelRatio, 2) // Cap resolution to prevent OOM memory bloating on high-DPI mobiles
      });

      this.updateCharts(this.widgetDetails);

      // Handle viewport dimension adjustments gracefully on mobile phone layout toggles
      this.resizeListener = () => this.pieChart?.resize();
      window.addEventListener('resize', this.resizeListener);
    });
  }

  updateCharts(data: any[]) {
    if (!this.pieChart || !data || data.length === 0) return;

    // FIX: Aggregate data natively in TypeScript to avoid heavy internal transform engines crashing mobile tabs
    const aggregatedMap = new Map<string, number>();
    data.forEach((item: any) => {
      if (item && item.paymentMode) {
        const currentSum = aggregatedMap.get(item.paymentMode) || 0;
        aggregatedMap.set(item.paymentMode, currentSum + Number(item.amount || 0));
      }
    });

    const cleanAggregatedData = Array.from(aggregatedMap.entries()).map(([key, val]) => ({
      paymentMode: key,
      totalAmount: val
    }));

    // Run UI component bindings inside the proper execution scope
    this.ngZone.runOutsideAngular(() => {
      this.pieChart?.setOption({
        dataset: [
          {
            source: cleanAggregatedData // Clean aggregated object array mapping
            // FIX: Removed 'sourceHeader: true' so objects parse accurately
          }
        ],
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          radius: ['35%', '60%'], // Optimized responsive radius spectrum for compact mobile dimensions
          center: ['50%', '50%'], 
          avoidLabelOverlap: true,
          padAngle: 4,
          label: {
            show: true,
            position: 'outside',       
            formatter: '{b}\n{c} ({d}%)', // Shows Mode label along with value metrics clearly
            fontSize: 10,
            fontWeight: '600',
            color: '#4a5568',          
            overflow: 'break'
          },
          labelLine: {
            show: true,
            length: 10,                
            length2: 8,               
            smooth: true,              
            lineStyle: {
              width: 1.5,
              color: '#cbd5e1'         
            }
          },
          itemStyle: {
            borderRadius: 5,           
            borderColor: '#fff',       
            borderWidth: 2
          },
          datasetIndex: 0,
          encode: { itemName: 'paymentMode', value: 'totalAmount' }
        }],
        // Clean responsive breakdown configs handling container layouts smoothly across screens
        media: [
          {
            query: { maxWidth: 640 },
            option: {
              series: [{
                radius: ['30%', '50%'],
                center: ['50%', '50%'],
                label: { fontSize: 9 }
              }]
            }
          }
        ]
      }, true); // Use 'true' flag to force clear existing configuration state entirely
    });
  }

  ngOnDestroy() {
    // Teardown everything cleanly to prevent background memory allocation leaks
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
    if (this.pieChart) {
      this.pieChart.dispose();
    }
  }
}


//  constructor() {
//     // 4. Update charts whenever data changes
//     effect(() => {
//   const data = this.expenses();
//   // Only update if the charts are actually initialized
//   if (this.barChart && this.pieChart) {
//     this.updateCharts(data);
//   }
// });
//   }

// ngAfterViewInit() {
//     echarts.registerTransform(aggregate as any);
//   this.barChart = echarts.init(this.barContainer()?.nativeElement);
//   this.pieChart = echarts.init(this.pieContainer()?.nativeElement);
  
//   // Manually trigger the first render once containers are ready
//   this.updateCharts(this.expenses());
  
//   window.addEventListener('resize', this.onResize);
// }

//   updateCharts(data: any[]) {
//     if (!this.barChart || !this.pieChart) return;

//     // 6. SHARED DATASET: Use the same array for both
//     const dataset = { source: data };

//     // --- FORM 1: BAR CHART ---
//    this.barChart.setOption({
//   dataset: [
//     { 
//       source: data,
//        sourceHeader: false,
//       dimensions: ['expenseName', 'expenseCategory', 'amount', 'paymentMode', 'mode', 'notes', 'currency', 'customGrouping']
//      },
//     {
//       transform: [
//         {
//           type: 'ecSimpleTransform:aggregate',
//           config: {
//              fromDatasetIndex: 0,
//             groupBy: 'expenseCategory',
//             resultDimensions: [
//               { from: 'expenseCategory', name: 'expenseCategory' },
//               { from: 'amount', method: 'sum', name: 'totalAmount' }
//             ]
//           }
//         }
//       ]
//     }
//   ],
//   tooltip: { trigger: 'axis' },
//   xAxis: { 
//     type: 'category', 
//     axisLabel: { 
//       interval: 0,
//       rotate: 30
//     } 
//   },
//   yAxis: {},
//   series: [{
//     type: 'bar',
//     datasetIndex: 1,
//     encode: { x: 'expenseCategory', y: 'totalAmount' }
//   }]
// });

//     // --- FORM 2: PIE CHART ---
//     this.pieChart.setOption({
//       dataset: dataset,
//       tooltip: { trigger: 'item' },
//       series: [{
//         type: 'pie',
//         radius: '50%',
//         encode: { itemName: 'expenseName', value: 'amount' }
//       }]
//     });

//     console.log(this.barChart.getOption());
//   }

//   onResize = () => {
//     this.barChart?.resize();
//     this.pieChart?.resize();
//   }

//   ngOnDestroy() {
//     // 7. DISPOSE: Release resources to avoid memory leaks
//     window.removeEventListener('resize', this.onResize);
//     this.barChart?.dispose();
//     this.pieChart?.dispose();
//   }
// }