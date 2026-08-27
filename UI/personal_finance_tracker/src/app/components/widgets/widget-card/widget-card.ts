import { Component, computed, effect, ElementRef, HostListener, Input, input, signal, viewChild, ViewChild } from '@angular/core';
import { Widget } from '../widget/widget';
import { SkeletonLoader } from '../../skeleton-loader/skeleton-loader';
import { BaseWidget } from 'gridstack/dist/angular';
import { ChartOptionGeneratorService } from '../../../logics/charts/chartOptionGenerator.logic';

@Component({
  selector: 'app-widget-card',
  imports: [Widget, SkeletonLoader],
  templateUrl: './widget-card.html',
  styleUrl: './widget-card.css',
})
export class WidgetCard extends BaseWidget {

  // Initialize signal with current innerWidth
  width = signal(typeof window !== 'undefined' ? window.innerWidth : 0);

  // Decorator catches window resize events natively without requiring Zone.js
  @HostListener('window:resize')
  onResize() {
    this.width.set(window.innerWidth);
  }

  chartHeight = signal<number>(90);



  public get widgetOptions(): WidgetOptions {
    const chartDetails = this.widgetDetails;

    if (!chartDetails || !chartDetails.chartConfig) {
      return { widgetId: '', option: null };
    }

    const chartOptions = this.chartOptionGeneratorService.generateOptions(chartDetails.chartConfig);

    // console.log('dddddddddddddd', chartOptions);
    
    return {
      widgetId: chartDetails.widgetId,
      option: chartOptions
    };
  }

  @Input() public widgetDetails!: WidgetDetails;
  @Input() public widgetCardLoader: boolean = false;

  constructor(private chartOptionGeneratorService: ChartOptionGeneratorService) {
    super();
  }
  private resizeObserver: ResizeObserver | null = null;
  private chartDom = viewChild.required<ElementRef>('widgetContainer');


  //       this.widgetOptions.set({
  //     option:  {

  //       dataset: [
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
  //       tooltip: { trigger: 'item' },
  //        legend: {

  //   left: 'right',
  //   orient: 'horizontal',
  //   bottom: '-7%',
  //    itemWidth: 12,        // Width of the color marker shape (Default: 25)
  //   itemHeight: 12,
  //   textStyle: {
  //     fontSize: 7,       // Pixel font size for text descriptions
  //     fontWeight: 500,  // Font thickness weight control ('normal', 'bold', etc.)
  //     color: '#4a5568'    // Custom HEX color string matching your UI theme
  //   }
  // },
  //       series: [{
  //         type: 'pie',
  //         radius: ['35%', '60%'], // Optimized responsive radius spectrum for compact mobile dimensions
  //         center: ['50%', '50%'], 
  //         avoidLabelOverlap: true,
  //         padAngle: 4,
  //         label: {
  //           show: true,
  //           position: 'outside',       
  //           formatter:  (params)=> {return '₹'+ params.value?.toString().split(',')[1].trim() || ''},  //'{d}%{c}', // Shows Mode label along with value metrics clearly
  //           fontSize: 6,
  //           fontWeight: 600,
  //           color: '#4a5568',          
  //           overflow: 'break'
  //         },
  //         labelLine: {
  //           show: true,
  //           length: 10,                
  //           length2: 8,               
  //           smooth: true,              
  //           lineStyle: {
  //             width: 1.5,
  //             color: '#cbd5e1'         
  //           }
  //         },
  //         itemStyle: {
  //           borderRadius: 5,           
  //           borderColor: '#fff',       
  //           borderWidth: 2
  //         },
  //         datasetIndex: 1,
  //         encode: { itemName: 'paymentMode', value: 'totalAmount' }
  //       }],
  //       // Clean responsive breakdown configs handling container layouts smoothly across screens
  //       media: [
  //         {
  //           query: { maxWidth: 640 },
  //           option: {
  //             series: [{
  //               radius: ['30%', '50%'],
  //               // center: ['50%', '50%'],
  //               label: { fontSize: 8 }
  //             }]
  //           }
  //         }
  //       ]
  // // Use 'true' flag to force clear existing configuration state entirely
  //   }
  //   })

  ngAfterViewInit() {
    const initialDimensions = this.chartDom()?.nativeElement?.getBoundingClientRect();
    if (initialDimensions.height > 0) {
      this.chartHeight.set(initialDimensions.height);
    }
    this.resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const freshHeight = Math.round(entry.contentRect.height);

        // Only trigger a state change if the height is truly different
        if (freshHeight !== this.chartHeight()) {
          window.requestAnimationFrame(() => {
            this.chartHeight.set(freshHeight);
          });
        }
      }
    });

    const targetElement = this.chartDom().nativeElement;
    if (targetElement) {
      this.resizeObserver.observe(targetElement);
    }
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }
}


