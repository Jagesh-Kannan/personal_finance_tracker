import { Component, computed, ElementRef, HostListener, input, Input, signal, Signal, viewChild } from '@angular/core';
import { StatisticCard } from "../statistic-card/statistic-card";

@Component({
  selector: 'statistic-block',
  imports: [StatisticCard],
  templateUrl: './statistic-block.html',
  styleUrl: './statistic-block.css',
})
export class StatisticBlock {

  private scrollList = viewChild<ElementRef>('scrollList');


  public statisticsList = input.required<StatisticDetail[]>();
  public cardLoader = input.required<boolean>();
  
  public hideLeftArrow = signal<boolean>(false);
  public hideRightArrow = signal<boolean>(false);
  
  private scrollTimeout: any;
  private isMobile = signal<boolean>(this.checkIfMobile());

  // Helper method to create skeleton placeholder data
  private createSkeletonCard(): StatisticDetail {
    return {
      title: '',
      note: [
        { value: '', symbol: '', direction: null, description: '', sign: null, graphData:[] }
      ],
      body: {
        currency: 'INR',
        value: '',
        color: '#f97316',
        symbol: null
      },
      footer: [
        { value: '', direction: null, description: '', sign: null }
      ]
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
      : this.statisticsList();
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
