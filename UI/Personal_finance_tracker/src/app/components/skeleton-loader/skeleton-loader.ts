import { Directive, Input, HostBinding } from '@angular/core';

@Directive({
  selector: '[skeletonLoader]',
  standalone: true
})
export class SkeletonLoader {
  // Pass the boolean loading state here
  @Input('skeletonLoader') isLoading = false;

  // Automatically adds/removes the class to the element the directive is on
  @HostBinding('class.is-loading') get loading() {
    return this.isLoading;
  }
}