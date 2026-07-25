import { Component, EventEmitter, input, Output, signal } from '@angular/core';
import { Gridster } from '../../gridster/gridster';
import { NgGridStackWidget } from 'gridstack/dist/angular';

@Component({
  selector: 'app-widget-grid',
  imports: [Gridster],
  templateUrl: './widget-grid.html',
  styleUrl: './widget-grid.css',
})
export class WidgetGrid {

  @Output() public onLayoutUpdated = new EventEmitter<NgGridStackWidget[]>();
  public enable_editing = input.required<boolean>();

  public widgetOptions = signal<NgGridStackWidget[]>([ 
        {x:0, y:0, content:'app-a'}, 
        {x:1, y:0, content:'app-a'}, 
        {x:1, y:1, content:'plain html'}, 
        {x:0, y:1, content:'app-b'} 
      ]);

  onLayoutUpdate(event:NgGridStackWidget[]){
    this.onLayoutUpdated.emit(event);
  }
}
