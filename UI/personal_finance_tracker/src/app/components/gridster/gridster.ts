import { Component, computed, EventEmitter, input, Output, signal, OnInit } from '@angular/core';
import { GridStackOptions, GridStackNode } from 'gridstack';
import { GridstackComponent, GridstackItemComponent, NgGridStackWidget } from 'gridstack/dist/angular';

@Component({
  selector: 'app-gridster',
  imports: [GridstackComponent, GridstackItemComponent],
  templateUrl: './gridster.html',
  styleUrl: './gridster.css',
})
export class Gridster implements OnInit {

  public gridConfigInput = input<GridStackOptions>();
  
  public liveWidgetOptions = signal<NgGridStackWidget[]>([]);

  public gridWidgetOptions = input.required<NgGridStackWidget[], NgGridStackWidget[]>({
    transform: (value: NgGridStackWidget[]) => {
      const initializedWidgets = value.map(w => ({
        ...w,
        id: w.id || this.generateShortId()
      }));
      this.liveWidgetOptions.set(initializedWidgets);
      return initializedWidgets;
    }
  });

  public enable_editing = input.required<boolean, boolean>({
    transform: (value: boolean): boolean => {
      this.gridConfigInit.set({
        ...this.gridConfigInit(),
        disableDrag: !value,
        disableResize: !value
      });
      return value;
    }
  });

  @Output() public onResizeEnd = new EventEmitter<{ event: Event; el: HTMLElement }>();
  @Output() public onDragEnd = new EventEmitter<{ event: Event; el: HTMLElement }>();
  @Output() public onLayoutUpdated = new EventEmitter<NgGridStackWidget[]>();

  private gridConfigInit = signal<GridStackOptions>({});

  private gridConfig = computed(() => {
    return {
      ...this.gridConfigInit(),
      ...this.gridConfigInput()
    };
  });

  public gridsterOptions = computed(() => {
    return {
      ...this.gridConfig(),
      children: this.liveWidgetOptions(),
    };
  });

  ngOnInit() {
    this.initializeGridConfig();
  }

  private generateShortId(): string {
    const random4Digit = Math.floor(1000 + Math.random() * 9000);
    return `grid_${random4Digit}`;
  }

  /**
   * FIXED: Explicitly checks the current state of 'enable_editing()'
   * so it doesn't stomp over the transform block parameters during initialization.
   */
  initializeGridConfig() {
    const isEditingEnabled = this.enable_editing();

    this.gridConfigInit.set({
      margin: 5,
      float: true,
      minRow: 1,
      cellHeight: 200,
      columnOpts: { breakpoints: [{ w: 768, c: 1 }] },
      disableDrag: !isEditingEnabled,
      disableResize: !isEditingEnabled
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
    const targetId = element.getAttribute('gs-id');
    if (!targetId) return;

    const updatedX = parseInt(element.getAttribute('gs-x') || '0', 10);
    const updatedY = parseInt(element.getAttribute('gs-y') || '0', 10);
    const updatedW = parseInt(element.getAttribute('gs-w') || '1', 10);
    const updatedH = parseInt(element.getAttribute('gs-h') || '1', 10);

    const updatedWidgets = this.liveWidgetOptions().map(widget => {
      if (widget.id === targetId) {
        return {
          ...widget,
          x: updatedX,
          y: updatedY,
          w: updatedW,
          h: updatedH
        };
      }
      return widget;
    });

    this.liveWidgetOptions.set(updatedWidgets);
    this.onLayoutUpdated.emit(updatedWidgets);
  }
}
