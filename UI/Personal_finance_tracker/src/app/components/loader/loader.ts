import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[buttonLoader]',
  standalone: true
})
export class ButtonLoader implements OnChanges {
  @Input('buttonLoader') isLoading = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges() {
    if (this.isLoading) {
      // 1. Measure the host element
      const hostRect = this.el.nativeElement?.getBoundingClientRect();
      // Calculate size: use 45% of height, but keep it between 12px and 30px
      const dynamicSize = Math.min(Math.max(hostRect.height * 0.45, 12), 30);
      const yAdjust = dynamicSize/4;
console.log(yAdjust);

      const loaderElement = this.renderer.createElement('span');
      this.renderer.addClass(loaderElement, 'loader-overlay');
      this.renderer.setStyle(loaderElement, "float",'right');
      this.renderer.setStyle(loaderElement, 'margin-right', '14px')
      this.renderer.setStyle(loaderElement, 'margin-left', '8px');
      this.renderer.setStyle(loaderElement, 'position', 'relative');
      this.renderer.setStyle(loaderElement, 'top', yAdjust.toString()+'px');

      const iconElement = this.renderer.createElement('svg', 'svg');

      // 2. Apply Dynamic Size
      this.renderer.setAttribute(iconElement, 'width', dynamicSize.toString());
      this.renderer.setAttribute(iconElement, 'height', dynamicSize.toString());
      this.renderer.setAttribute(iconElement, 'viewBox', '0 0 24 24'); // Viewbox stays 24 for scaling
      
      this.renderer.setAttribute(iconElement, 'fill', 'none');
      this.renderer.setAttribute(iconElement, 'stroke', 'currentColor');
      this.renderer.setAttribute(iconElement, 'stroke-width', '2');
      this.renderer.setAttribute(iconElement, 'stroke-linecap', 'round');
      this.renderer.setAttribute(iconElement, 'stroke-linejoin', 'round');
      this.renderer.setStyle(iconElement, 'animation', 'spin 1s linear infinite');

      const path = this.renderer.createElement('path', 'svg');
      this.renderer.setAttribute(path, 'd', 'M21 12a9 9 0 1 1-6.219-8.56');
      
      this.renderer.appendChild(iconElement, path);
      this.renderer.appendChild(loaderElement, iconElement);
      this.renderer.appendChild(this.el.nativeElement, loaderElement);
    } else {
      const existingLoader = this.el.nativeElement.querySelector('.loader-overlay');
      if (existingLoader) {
        this.renderer.removeChild(this.el.nativeElement, existingLoader);
      }
    }
  }
}