import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { lucideDefaultConfig, LucideDynamicIcon, LucideEye, LucideEyeClosed,  } from '@lucide/angular';

@NgModule({
  declarations: [],
  imports: [CommonModule, LucideDynamicIcon, LucideEye, LucideEyeClosed],
  exports: [LucideDynamicIcon, LucideEye, LucideEyeClosed],
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
