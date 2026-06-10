import { Component, ElementRef, Input, SimpleChanges, viewChild } from '@angular/core';
import * as echarts from 'echarts';
import { aggregate } from '@manufac/echarts-simple-transform';

@Component({
  selector: 'app-widget',
  imports: [],
  templateUrl: './widget.html',
  styleUrl: './widget.css',
  standalone: true
})
export class Widget {

  @Input() widgetDetails:any;

  pieContainer = viewChild<ElementRef>('pieContainer');
  private pieChart?: echarts.ECharts;

  constructor() {}


  ngOnChanges(changes:SimpleChanges){
 console.log(this.widgetDetails);
    changes['widgetDetails'] && this.updateCharts(this.widgetDetails);
  }

  ngAfterViewInit(){

    echarts.registerTransform(aggregate as any);
    this.pieChart = echarts.init(this.pieContainer()?.nativeElement);

   
    
    this.updateCharts(this.widgetDetails);
    
  }

  updateCharts(data:any[]){
     if (!this.pieChart) return;

    // 6. SHARED DATASET: Use the same array for both
    const dataset = { source: data };

    // --- FORM 1: BAR CHART ---
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

if (data.length > 0) {
  // 2. Automatically extract keys from the first object to use as row 0 headers
  const dynamicHeaders = Object.keys(data[0]);
}

// data = [['expenseName', 'expenseCategory', 'amount', 'paymentMode', 'mode', 'notes', 'currency', 'customGrouping'],...data]
    // --- FORM 2: PIE CHART ---
  //   this.pieChart.setOption({
  //     dataset: [
  //        { 
  //     source: data,
  //      sourceHeader: true,
  //     dimensions: ['expenseName', 'expenseCategory', 'amount', 'paymentMode', 'mode', 'notes', 'currency', 'customGrouping']
  //    },
     
  //      {
  //     transform: [
  //       {
  //         type: 'ecSimpleTransform:aggregate',
  //         config: {
  //           fromDatasetIndex: 0,
  //           groupBy: 'paymentMode', // Matches the exact case-sensitive key in your object
  //           resultDimensions: [
  //             { from: 'paymentMode', name: 'paymentMode' },
  //             { from: 'amount', method: 'sum', name: 'totalAmount' }
  //           ]
  //         }
  //       }
  //     ],
  //   },
  //     ],
  //      grid: {
  //   top: 40,      // Reserves an explicit pixel buffer zone at the top of the canvas box
  //   bottom: 40,
  //   left: 20,
  //   right: 20,
  //   containLabel: true // Instructs the renderer to compute text heights within the grid layout
  // },
  //     tooltip: { trigger: 'item' },
  // //    legend: {
  // //   // top: '5%',
  // //   left: 'left',
  // //   orient: 'vertical',
  // //   bottom: '0%',
  // //    itemWidth: 14,        // Width of the color marker shape (Default: 25)
  // //   itemHeight: 14,
  // //   textStyle: {
  // //     fontSize: 9,       // Pixel font size for text descriptions
  // //     fontWeight: '500',  // Font thickness weight control ('normal', 'bold', etc.)
  // //     color: '#4a5568'    // Custom HEX color string matching your UI theme
  // //   }
  // // },
  //     series: [{
  //       type: 'pie',
  //           radius: ['40%', '70%'],
  //            center: ['50%', '53%'], 
  //     avoidLabelOverlap: false,
  //     padAngle: 5,
      
  //      label: {
  //     show: true,
  //     position: 'outside',       // Options: 'outside' (cleanest), 'inside', 'center'
  //     formatter: '{c}\n({d}%)',  // Displays Title text on line 1, percentage on line 2
  //     fontSize: 8,
  //     fontWeight: '600',
  //     color: '#4a5568',          // Matches your dark/light UI text layer variables
  //     bleedMargin: 5,             // Prevents text overflow cutting near canvas edges
  //       margin: 8,          // Distance margins between labels to avoid collisions
  //     overflow: 'break',  // Options: 'break', 'truncate', 'none'. Prevents clipping.
  //     minMargin: 5, 
  //   },
    
  //   /* 3. STYLE THE CONNECTOR POINTER LINES */
  //   labelLine: {
  //     show: true,
  //     length: 15,                // Length of the first pointer section from the slice ring
  //     length2: 10,               // Length of the second horizontal connector under the text
  //     smooth: true,              // Gives pointer lines a premium curved arc look
  //     lineStyle: {
  //       width: 1.5,
  //       color: '#cbd5e1'         // Soft light gray indicator tracking line
  //     }
  //   },
    
  //   /* 4. PREMIUM UI TOUCHES */
  //   itemStyle: {
  //     borderRadius: 6,           // Rounds the sharp outer corners of the ring slices
  //     borderColor: '#fff',       // Adds a clean white separation grid border gap
  //     borderWidth: 2
  //   },
  //       datasetIndex: 1,
  //       encode: { itemName: 'paymentMode', value: 'totalAmount' }
  //     }],
  //      media: [
  //   {
  //     query: { maxWidth: 640 }, // MOBILE OVERRIDES
  //     option: {
  //       series: [{itemStyle: {
  //       borderRadius: 4
  //     }, center: ['50%', '40%'] }],
  // //        legend: {
  // //   top: '5%',
  // //   left: 'left',
  // //   orient: 'vertical',
  // //   // bottom: '0%',
  // //    itemWidth: 14,        // Width of the color marker shape (Default: 25)
  // //   itemHeight: 14,
  // //   textStyle: {
  // //     fontSize: 9,       // Pixel font size for text descriptions
  // //     fontWeight: '500',  // Font thickness weight control ('normal', 'bold', etc.)
  // //     color: '#4a5568'    // Custom HEX color string matching your UI theme
  // //   }
  // // },
  //     }
  //   },
  //   {
  //     query: { minWidth: 1024 }, // DESKTOP OVERRIDES
  //     option: {
  //       series: [{ itemStyle: {
  //       borderRadius: 4
  //     }, center: ['40%', '50%'] }],
  //       // legend: { orient: 'vertical', right: '5%' }
  //     }
  //   }
  // ]
  //   });





      this.pieChart.setOption({
        dataset: [
         { 
      source: data,
       sourceHeader: true,
      dimensions: ['expenseName', 'expenseCategory', 'amount', 'paymentMode', 'mode', 'notes', 'currency', 'customGrouping']
     },
     
       {
      transform: [
        {
          type: 'ecSimpleTransform:aggregate',
          config: {
            fromDatasetIndex: 0,
            groupBy: 'paymentMode', // Matches the exact case-sensitive key in your object
            resultDimensions: [
              { from: 'paymentMode', name: 'paymentMode' },
              { from: 'amount', method: 'sum', name: 'totalAmount' }
            ]
          }
        }
      ],
    },
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
            formatter: '{c} ({d}%)', // Shows Mode label along with value metrics clearly
            fontSize: 8,
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
          datasetIndex: 1,
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
  // Use 'true' flag to force clear existing configuration state entirely
    });

  }

  ngOnDestroy() {
    // 7. DISPOSE: Release resources to avoid memory leaks
    // window.removeEventListener('resize', this.onResize);
    
    this.pieChart?.dispose();
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