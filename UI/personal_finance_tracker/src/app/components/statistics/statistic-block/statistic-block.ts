import { Component, ElementRef, HostListener, input, Input, signal, Signal, viewChild } from '@angular/core';
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
  
  public hideLeftArrow = signal<boolean>(false);
  public hideRightArrow = signal<boolean>(false);

  ngAfterViewInit() {
    // Initial check after view loads
    this.checkContentScrolled(this.scrollList()?.nativeElement);
  }

  @HostListener('window:resize')
  onResize() {
    this.checkContentScrolled(this.scrollList()?.nativeElement);
  }

  scrollTo(direction: 'left' | 'right', element: HTMLElement) {
 
    // 320px is a good default (300px card + 20px gap)
    const scrollAmount = direction === 'left' ? -230 : 230;
    
    element.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }

  checkContentScrolled(element:HTMLElement ){
     this.hideLeftArrow.set(element.scrollLeft > 10);
     this.hideRightArrow.set((element.scrollWidth-element.clientWidth) !== element.scrollLeft)
  }
}
