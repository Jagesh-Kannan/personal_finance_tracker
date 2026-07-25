import { Component, input, signal } from '@angular/core';
import { Gridster } from '../../gridster/gridster';
import { NgGridStackWidget } from 'gridstack/dist/angular';

@Component({
  selector: 'app-widget-grid',
  imports: [Gridster],
  templateUrl: './widget-grid.html',
  styleUrl: './widget-grid.css',
})
export class WidgetGrid {

  public enable_editing = input.required<boolean>();

  public widgetOptions = signal<NgGridStackWidget[]>([ 
        {x:0, y:0, content:'app-a'}, 
        {x:1, y:0, content:'app-a'}, 
        {x:1, y:1, content:'plain html'}, 
        {x:0, y:1, content:'app-b'} 
      ]);
}
