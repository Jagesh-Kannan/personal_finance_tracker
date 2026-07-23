import { Component, computed, effect, input, signal } from '@angular/core';
import { GridStack, GridStackOptions, GridStackWidget } from 'gridstack';
import { GridstackComponent, GridstackItemComponent, NgGridStackOptions, NgGridStackWidget, elementCB, gsCreateNgComponents, nodesCB } from 'gridstack/dist/angular';

@Component({
  selector: 'app-gridster',
  imports: [GridstackComponent, GridstackItemComponent],
  templateUrl: './gridster.html',
  styleUrl: './gridster.css',
})
export class Gridster {


    public gridConfigInput = input<GridStackOptions>();
    public gridWidgetOptions = input.required<NgGridStackWidget[]>();


    private gridConfigInit = signal<GridStackOptions>({});

    private gridConfig = computed(()=> {
      return {
        ...this.gridConfigInit(),
        ...this.gridConfigInput()
      }}
    )

    public gridsterOptions =  computed( () => {
       const gridOptions = this.gridConfig();
       const gridWidgetOptions = this.gridWidgetOptions();

        return {
          ...gridOptions,
          children: gridWidgetOptions,
        }
    }); 

   
  ngOnInit(){
    this.initializeGridConfig();
  }

  initializeGridConfig(){
    this.gridConfigInit.set(
      {
        margin: 5,
        float: true,
        minRow: 1,
        cellHeight: 200,
        columnOpts: { breakpoints: [{w:768, c:1}] },
      }
    );
  }

  onResizeEnds(event:  { event: Event; el: HTMLElement }){
    console.log("resize");
    
    console.log(event);
  }

  onDragEnds(event: { event: Event; el: HTMLElement }){
    console.log("drag");
    console.log(event);
    
    
  }

}
