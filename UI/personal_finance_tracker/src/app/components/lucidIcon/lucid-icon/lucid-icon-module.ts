import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { lucideDefaultConfig, LucideDynamicIcon, LucideEye, LucideEyeClosed, LucideFileText, LucideLoaderCircle, LucideLayoutDashboard, LucidePlus, LucideSearch, LucideHistory, LucideUser, LucideCheckCircle2, LucideAlertCircle, LucideAlertTriangle, LucideInfo, LucideX } from '@lucide/angular';

@NgModule({
  declarations: [],
  imports: [CommonModule, LucideDynamicIcon, LucideEye, LucideEyeClosed, LucideFileText, LucideLoaderCircle, LucideLayoutDashboard, LucidePlus, LucideSearch, LucideHistory, LucideUser, LucideCheckCircle2, LucideAlertCircle, LucideAlertTriangle, LucideInfo, LucideX],
  exports: [LucideDynamicIcon, LucideEye, LucideEyeClosed, LucideFileText, LucideLoaderCircle, LucideLayoutDashboard, LucidePlus, LucideSearch, LucideHistory, LucideUser, LucideCheckCircle2, LucideAlertCircle, LucideAlertTriangle, LucideInfo, LucideX],
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
