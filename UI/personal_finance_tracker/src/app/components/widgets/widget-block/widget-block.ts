import { Component, computed, ElementRef, HostListener, input, signal, viewChild } from '@angular/core';
import { WidgetCard } from '../widget-card/widget-card';

@Component({
  selector: 'app-widget-block',
  imports: [WidgetCard],
  templateUrl: './widget-block.html',
  styleUrl: './widget-block.css',
})
export class WidgetBlock {

  private generateShortId(): string {
    // Generates a random 4-digit number between 1000 and 9999
    const random4Digit = Math.floor(1000 + Math.random() * 9000);
    return `wdgt_${random4Digit}`;
  }

  private scrollList = viewChild<ElementRef>('scrollList');


  public widgetList = input.required< Omit<WidgetDetails, 'widgetId'>[]>();
  public cardLoader = input.required<boolean>();
  
  public hideLeftArrow = signal<boolean>(false);
  public hideRightArrow = signal<boolean>(false);
  
  private scrollTimeout: any;
  private isMobile = signal<boolean>(this.checkIfMobile());

  // Helper method to create skeleton placeholder data
  private createSkeletonCard(): WidgetDetails {
    return {
      title: '',
      widgetId: '',
      description: '',
      chartConfig: {
        rawData: [],
        chartType: 'pie',
      }
    };
  }

  // Check if device is mobile
  private checkIfMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // Snap to nearest card on mobile
  private snapToNearestCard(element: HTMLElement): void {
    const cardWidth = 257; // Card width + gap
    const scrollLeft = element.scrollLeft;
    const remainder = scrollLeft % cardWidth;
    
    if (remainder > cardWidth / 2) {
      // Snap to next card
      element.scrollBy({
        left: cardWidth - remainder,
        behavior: 'smooth'
      });
    } else if (remainder > 0) {
      // Snap to previous card
      element.scrollBy({
        left: -remainder,
        behavior: 'smooth'
      });
    }
  }

  // Computed signal to display skeleton loaders while loading or actual data when loaded
  public displayList = computed(() => {
    return this.cardLoader() 
      ? Array(4).fill(null).map(() => this.createSkeletonCard())
      : this.widgetList().map(widget => ({ ...widget, widgetId: this.generateShortId() }));
  });

  ngAfterViewInit() {
    // Initial check after view loads
    this.checkContentScrolled(this.scrollList()?.nativeElement);
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobile.set(this.checkIfMobile());
    this.checkContentScrolled(this.scrollList()?.nativeElement);
  }

  scrollTo(direction: 'left' | 'right', element: HTMLElement) {
 
    // 320px is a good default (300px card + 20px gap)
    const scrollAmount = direction === 'left' ? -257 : 257;
    
    element.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }

  checkContentScrolled(element: HTMLElement) {
    this.hideLeftArrow.set(element.scrollLeft > 10);
    this.hideRightArrow.set((element.scrollWidth - element.clientWidth) > element.scrollLeft + 10);
    
    // On mobile, snap to nearest card after user stops scrolling
    if (this.isMobile()) {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
        this.snapToNearestCard(element);
      }, 150); // 150ms delay after scroll ends
    }
  }

}
