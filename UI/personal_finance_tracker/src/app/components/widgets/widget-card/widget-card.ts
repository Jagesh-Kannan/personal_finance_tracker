import { Component, effect, input, Input, signal } from '@angular/core';
import { Widget } from '../widget/widget';

@Component({
  selector: 'app-widget-card',
  imports: [Widget],
  templateUrl: './widget-card.html',
  styleUrl: './widget-card.css',
})
export class WidgetCard {

    public readonly statsUUID = signal<string>(this.generateShortId());
      private generateShortId(): string {
    // Generates a random 4-digit number between 1000 and 9999
    const random4Digit = Math.floor(1000 + Math.random() * 9000);
    return `wdgt_${random4Digit}`;
  }

  public widgetOptions = signal<widgetOptions>({
    option: null
  });

  public widgetDetails = input.required<widgetDetails>();

  constructor(){
    effect(()=>{
      const chartDetails = this.widgetDetails();
      this.updateWidgetOptions(chartDetails.chartOptions);
    })
  }

  updateWidgetOptions(data: any){
    console.log('changes');
    

        this.widgetOptions.set({
      option:  {
    
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
         legend: {
    // top: '5%',
    left: 'right',
    orient: 'vertical',
    bottom: '0%',
     itemWidth: 12,        // Width of the color marker shape (Default: 25)
    itemHeight: 12,
    textStyle: {
      fontSize: 7,       // Pixel font size for text descriptions
      fontWeight: 500,  // Font thickness weight control ('normal', 'bold', etc.)
      color: '#4a5568'    // Custom HEX color string matching your UI theme
    }
  },
        series: [{
          type: 'pie',
          radius: ['35%', '60%'], // Optimized responsive radius spectrum for compact mobile dimensions
          center: ['35%', '53%'], 
          avoidLabelOverlap: true,
          padAngle: 4,
          label: {
            show: true,
            position: 'outside',       
            formatter: '{d}%', // Shows Mode label along with value metrics clearly
            fontSize: 6,
            fontWeight: 600,
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
                // center: ['50%', '50%'],
                label: { fontSize: 8 }
              }]
            }
          }
        ]
  // Use 'true' flag to force clear existing configuration state entirely
    }
    })
  }

  ngAfterContentInit(){

  }
}


