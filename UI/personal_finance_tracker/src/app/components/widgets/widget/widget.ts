import { Component, ElementRef, HostListener, Input, SimpleChanges, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import { aggregate } from '@manufac/echarts-simple-transform';

@Component({
  selector: 'app-widget',
  imports: [],
  templateUrl: './widget.html',
  styleUrl: './widget.css',
  standalone: true,
})
export class Widget {
  @ViewChild('chartDom', { static: true }) chartDom!: ElementRef<HTMLDivElement>;

  @Input({ required: true }) widgetOptions!: WidgetOptions;
  @Input() width: string = '100%';
  @Input() height: string = '120px';

  private chartInstance: echarts.ECharts | null = null;
  private resizeObserver: ResizeObserver | null = null;

  @HostListener('window:scroll')
  @HostListener('window:touchmove')
  hideTooltipOnScroll() {
    if (this.chartInstance) {
      // Programmatically trigger ECharts to hide the active tooltip
      this.chartInstance.dispatchAction({
        type: 'hideTip'
      });
    }
  }

  ngOnInit(): void {
    this.initChart();
  }

  ngOnChanges(changes: SimpleChanges): void {

    // Dynamically update options if they change in the parent component
    if (changes['widgetOptions'] && !changes['widgetOptions'].firstChange) {
      this.updateChartOptions();
    }
  }

  private initChart(): void {
    // 1. Initialize the ECharts instance inside the DOM element
    echarts.registerTransform(aggregate as any);
    this.chartInstance = echarts.init(this.chartDom.nativeElement);
    this.updateChartOptions();

    // 2. Handle dynamic resizing using ResizeObserver (Safer than window:resize)
    this.resizeObserver = new ResizeObserver(() => {
      if (this.chartInstance) {
        // requestAnimationFrame prevents "ResizeObserver loop limit exceeded" browser errors
        // and guarantees smooth resizing transitions on slow mobile devices
        window.requestAnimationFrame(() => {
          this.chartInstance?.resize({
            animation: {
              duration: 200, // Smooth 300ms layout transition when resizing/rotating screen
              easing: 'quadraticOut',
            },
          });
        });
      }
    });
    this.resizeObserver.observe(this.chartDom.nativeElement);
  }

  private updateChartOptions(): void {
    if (this.chartInstance && this.widgetOptions.option) {
      // The second argument 'true' forces a clean redraw on data changes
      this.chartInstance.setOption(this.widgetOptions.option, true);
    }
  }

  ngOnDestroy(): void {
    // 3. Close the instance dynamically to avoid memory leaks
    this.resizeObserver?.disconnect();
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  }
}