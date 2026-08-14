import { Component, computed, EventEmitter, input, Output, signal, effect, viewChild, untracked } from '@angular/core';
import { Gridster } from '../../gridster/gridster';
import { GridstackComponent, NgGridStackWidget } from 'gridstack/dist/angular';
import { WidgetCard } from '../widget-card/widget-card';


@Component({
  selector: 'app-widget-grid',
  imports: [Gridster, WidgetCard],
  templateUrl: './widget-grid.html',
  styleUrl: './widget-grid.css',
})
export class WidgetGrid {

  @Output() public onLayoutUpdated = new EventEmitter<NgGridStackWidget[]>();

  public widgetBaseConfigList = input.required<WidgetDetails[]>();
  public widgetRawDataList = input<{widgetId:string, rawData:any[]}[]>([]);
  public enable_editing = input.required<boolean>();


  constructor() {
    GridstackComponent.addComponentToSelectorType([
      WidgetCard
    ]);
  }


  public widgetOptions = computed<(NgGridStackWidget & { type: string; })[]>(() => {

    return this.widgetBaseConfigList().map(widget => {
    
      return {
        // x: 0, 
        // y: 0, 
        // w: 2, 
        type: 'widget-card',     
        input: { 
          widgetDetails: {...widget, chartConfig: {...widget.chartConfig, rawData: this.widgetRawDataList().find(d => d.widgetId === widget.widgetId)?.rawData || [] }}, 
          widgetCardLoader: false
         },
      };
    })

  });

  onLayoutUpdate(event: NgGridStackWidget[]) {
    this.onLayoutUpdated.emit(event);
  }
}
