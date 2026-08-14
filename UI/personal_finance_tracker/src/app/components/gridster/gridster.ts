import { Component, computed, effect, EventEmitter, input, Output, signal, ViewChild, OnInit, viewChild } from '@angular/core';
import { GridStack, GridStackOptions } from 'gridstack';
import { GridstackComponent, GridstackItemComponent, NgGridStackOptions, NgGridStackWidget } from 'gridstack/dist/angular';
import { WidgetCard } from '../widgets/widget-card/widget-card';

@Component({
  selector: 'app-gridster',
  imports: [GridstackComponent, GridstackItemComponent, WidgetCard],
  templateUrl: './gridster.html',
  styleUrl: './gridster.css',
})
export class Gridster implements OnInit {
  // Read references to the Gridstack wrapper element tree
  @ViewChild(GridstackComponent) public gridstackComponent!: GridstackComponent;

  public gridConfigInput = input<GridStackOptions>();
  public gridWidgetOptions = input.required<(NgGridStackWidget & { type: string })[]>();
  private updatedLayout = signal<NgGridStackWidget[]>([]);
  
  // 1. Keep this as a pure input property now. No inline transform logic here.
  public enable_editing = input.required<boolean>();

  @Output() public onResizeEnd = new EventEmitter<{ event: Event; el: HTMLElement }>();
  @Output() public onDragEnd = new EventEmitter<{ event: Event; el: HTMLElement }>();
  @Output() public onLayoutUpdated = new EventEmitter<NgGridStackWidget[]>();

  private gridConfigInit = signal<GridStackOptions>({});

  // 2. Keep gridConfig pure (No reactive toggles inside it)
  public gridConfig = computed(() => {
    return {
      ...this.gridConfigInit(),
      ...this.gridConfigInput()
    };
  });

  // 3. Generates layout data safely without forcing re-renders
  public gridsterOptions = computed(() => {
    const gridOptions = this.gridConfig();
    return {
      ...gridOptions,
    };
  });

  public gridWidgetOptionsComputed = computed(() => {
    return this.gridWidgetOptions().map(widget => {
         return {
          ...widget,
          id: this.generateShortId()
         }
    });
  });

  constructor() {
    /**
     * 4. THE FIX: Toggle interactivity through the Gridstack Instance API
     * instead of resetting the signal configuration block.
     */
    effect(() => {
      const isEditingEnabled = this.enable_editing();
      
      // Ensure the Gridstack JS engine is initialized before running
      const gridInstance: GridStack | undefined = this.gridstackComponent?.grid;
      
      if (gridInstance) {
        // setStatic(true) freezes dragging/resizing. setStatic(false) enables it.
        gridInstance.setStatic(!isEditingEnabled);
      }
    });
  }

  ngOnInit() {
    this.initializeGridConfig();
  }

  private generateShortId(): string {
    const random4Digit = Math.floor(1000 + Math.random() * 9000);
    return `grid_${random4Digit}`;
  }

  initializeGridConfig() {
    this.gridConfigInit.set({
      margin: 5,
      float: true,
      minRow: 1,
      cellHeight: 200,
      columnOpts: { breakpoints: [{ w: 768, c: 2 }] },
      // Start as static if editing is false on load
      staticGrid: !this.enable_editing() 
    });
  }

  onResizeEnds(event: { event: Event; el: HTMLElement }) {
    this.updateWidgetCoordinatesInState(event.el);
    this.onResizeEnd.emit(event);
  }

  onDragEnds(event: { event: Event; el: HTMLElement }) {
    this.updateWidgetCoordinatesInState(event.el);
    this.onDragEnd.emit(event);
  }

    private updateWidgetCoordinatesInState(element: HTMLElement): void {
    // Retrieve the unique ID string Gridstack injected onto the DOM node
    const targetId = element.getAttribute('gs-id');
    if (!targetId) return;

    // Parse the live coordinates from the HTML layout node attributes
    const updatedX = parseInt(element.getAttribute('gs-x') || '0', 10);
    const updatedY = parseInt(element.getAttribute('gs-y') || '0', 10);
    const updatedW = parseInt(element.getAttribute('gs-w') || '1', 10);
    const updatedH = parseInt(element.getAttribute('gs-h') || '1', 10);
    
    // Update the layout model array state immutably
    const updatedWidgets = this.gridConfig().children?.filter(d=>d.id === targetId).map(widget => {
        return {
          ...widget,
          x: updatedX,
          y: updatedY,
          w: updatedW,
          h: updatedH
        };
    });
    // Save back to the signal loop so it won't jump back when editing turns off
    this.updatedLayout.set({...this.updatedLayout(), ...updatedWidgets});
    
    // Notify parent component that layout changed
    this.onLayoutUpdated.emit(this.updatedLayout());
  }
}
