import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { lucideDefaultConfig, LucideDynamicIcon, LucideEye, LucideEyeClosed, LucideFileText, LucideLoaderCircle } from '@lucide/angular';

@NgModule({
  declarations: [],
  imports: [CommonModule, LucideDynamicIcon, LucideEye, LucideEyeClosed, LucideFileText, LucideLoaderCircle],
  exports: [LucideDynamicIcon, LucideEye, LucideEyeClosed, LucideFileText, LucideLoaderCircle],
  providers: [
    {
      provide: lucideDefaultConfig,
      useValue: {
        size: 18,
        strokeWidth: 2,
        color: 'currentColor',
      },
    },
  ],
})
export class LucidIconModule {}
