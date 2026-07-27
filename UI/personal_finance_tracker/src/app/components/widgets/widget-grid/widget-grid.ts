import { Component, computed, EventEmitter, input, Output, signal, effect } from '@angular/core';
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

  public widgetList = input.required<Omit<WidgetDetails, 'widgetId'>[]>();
  public enable_editing = input.required<boolean>();


  constructor() {
    GridstackComponent.addComponentToSelectorType([
      WidgetCard
    ]);
  }

  private generateShortId(): string {
    const random4Digit = Math.floor(1000 + Math.random() * 9000);
    return `wdgt_${random4Digit}`;
  }

  public widgetOptions = computed<NgGridStackWidget[]>(() => {

    return this.widgetList().map(widget => {
      const widgetDetails = { ...widget, widgetId: this.generateShortId() };
      return {
        // x: 0, 
        // y: 0, 
        // w: 2, 
        selector: 'app-widget-card',
        input: { widgetDetails: widgetDetails, widgetCardLoader: false }
      };
    })

  });

  onLayoutUpdate(event: NgGridStackWidget[]) {
    this.onLayoutUpdated.emit(event);
  }
}
