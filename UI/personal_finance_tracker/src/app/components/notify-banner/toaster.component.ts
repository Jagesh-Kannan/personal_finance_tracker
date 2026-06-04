import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToasterService, type ToasterType } from '../../service/toaster.service';
import {
  LucideInfo,
  LucideX,
  LucideCircleCheckBig,
  LucideCircleAlert,
  LucideTriangleAlert,
} from '@lucide/angular';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [
    CommonModule,
    LucideCircleCheckBig,
    LucideCircleAlert,
    LucideTriangleAlert,
    LucideInfo,
    LucideX,
  ],
  template: `
    <div class="toaster-container" [ngClass]="'position-' + toasterService.config().position">
      @for (toaster of toasterService.toasters(); track toaster.id; let index = $index) {
        <div
          class="toaster-item"
          [ngClass]="[toaster.type, 'animate-slide-up']"
          [style.--stagger-delay]="index * 0.1 + 's'"
          (touchstart)="onTouchStart($event, toaster.id); $event.stopPropagation();"
          (touchend)="onTouchEnd($event, toaster.id)"
        >
          <!-- Glass Background -->
          <div class="toaster-glass"></div>

          <!-- Content -->
          <div class="toaster-content">
            <!-- Icon -->
            <div class="toaster-icon">
              @switch (toaster.type) {
                @case ('success') {
                  <svg lucideCircleCheckBig></svg>
                  <!-- <lucide-check-circle-2 [size]="20" [strokeWidth]="2"></lucide-check-circle-2> -->
                }
                @case ('error') {
                  <svg lucideCircleAlert></svg>
                  <!-- <lucide-alert-circle [size]="20" [strokeWidth]="2"></lucide-alert-circle> -->
                }
                @case ('warning') {
                  <svg lucideTriangleAlert></svg>
                  <!-- <lucide-alert-triangle [size]="20" [strokeWidth]="2"></lucide-alert-triangle> -->
                }
                @case ('info') {
                  <svg lucideInfo></svg>
                  <!-- <lucide-info [size]="20" [strokeWidth]="2"></lucide-info> -->
                }
              }
            </div>

            <!-- Header & Message -->
            <div class="toaster-text">
              @if (toaster.header) {
                <div class="toaster-header">{{ toaster.header }}</div>
              }
              <div class="toaster-message">{{ toaster.message }}</div>
            </div>
          </div>

          <!-- Close Button -->
          <button
            class="toaster-close"
            (click)="onClose(toaster.id)"
            aria-label="Close notification"
          >
            <svg lucideX></svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .toaster-container {
        position: fixed;
        display: flex;
        flex-direction: column;
        gap: 12px;
        z-index: 9999;
        pointer-events: none;
        padding: 16px;
      }

      /* Position Variants */
      .position-bottom-left {
        bottom: 0;
        left: 0;
      }

      .position-bottom-center {
        bottom: 8%;
        left: 50%;
        transform: translateX(-50%);
      }

      .position-bottom-right {
        bottom: 8%;
        right: 0;
      }

      .position-top-left {
        top: 8%;
        left: 0;
      }

      .position-top-center {
        top: 8%;
        left: 50%;
        transform: translateX(-50%);
      }

      .position-top-right {
        top: 8%;
        right: 0;
      }

      /* Toaster Item */
      .toaster-item {
        position: relative;
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 300px;
        max-width: 450px;
        padding: 7px 10px;
        border-radius: 62px;
        pointer-events: auto;
        overflow: hidden;
        animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        animation-delay: var(--stagger-delay);
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes slideDown {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(50px);
        }
      }

      .toaster-item.dismissed {
        animation: slideDown 0.3s ease forwards;
      }

      /* Glass Background */
      .toaster-glass {
        position: absolute;
        inset: 0;
        background: var(--glass-bg);
        //   border: 1px solid rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        z-index: -1;
      }

      /* Type-specific Colors & Borders */
      .toaster-item.success {
        color: var(--success-color);
        //   border-left: 4px solid var(--success-color);
      }

      .toaster-item.success .toaster-glass {
        background: var(--toster-bg);
      }

      .toaster-item.error {
        color: var(--error-color);
        //   border-left: 4px solid var(--error-color);
      }

      .toaster-item.error .toaster-glass {
        background: var(--toster-bg);
      }

      .toaster-item.warning {
        color: var(--warning-color);
        //   border-left: 4px solid var(--warning-color);
      }

      .toaster-item.warning .toaster-glass {
        background: var(--toster-bg);
      }

      .toaster-item.info {
        color: var(--accent-color);
        //   border-left: 4px solid var(--accent-color);
      }

      .toaster-item.info .toaster-glass {
        background: var(--toster-bg);
      }

      /* Dark Theme Color Adjustments */
      :root.dark-theme .toaster-item.success {
        color: var(--success-color);
      }

      :root.dark-theme .toaster-item.error {
        color: var(--error-color);
      }

      :root.dark-theme .toaster-item.warning {
        color: var(--warning-color);
      }

      :root.dark-theme .toaster-item.info {
        color: var(--accent-color);
      }

      /* Content Layout */
      .toaster-content {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
        min-width: 0;
      }

      /* Icon */
      .toaster-icon {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
      }

      /* Text Container */
      .toaster-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }

      /* Header */
      .toaster-header {
        font-weight: 600;
        font-size: 12px;
        line-height: 1.3;
      }

      /* Message */
      .toaster-message {
        font-size: 12px;
        line-height: 1;
        word-wrap: break-word;
        word-break: break-word;
      }

      /* Close Button */
      .toaster-close {
        flex-shrink: 0;
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 19px;
        height: 19px;
        border-radius: 4px;
        transition: all 0.2s ease;
        opacity: 0.7;
        padding: 0;
      }

      .toaster-close:hover {
        opacity: 1;
        background: rgba(255, 255, 255, 0.1);
      }

      .toaster-close:active {
        transform: scale(0.95);
      }

      /* Responsive */
      @media (max-width: 480px) {
        .toaster-item {
          min-width: 280px;
          max-width: 100%;
        }

        .toaster-container {
          padding: 12px;
        }
      }
    `,
  ],
})
export class ToasterComponent {
  protected readonly toasterService = inject(ToasterService);

  private touchStartY: number | null = null;

  onTouchStart(event: TouchEvent, id: string) {
    this.touchStartY = event.changedTouches[0].clientY;
     event.preventDefault();
  }

  onTouchEnd(event: TouchEvent, id: string) {
    if (this.touchStartY === null) return;

    const touchEndY = event.changedTouches[0].clientY;
    const deltaY = touchEndY - this.touchStartY;

    // Threshold to avoid accidental taps
    if (deltaY > 10) {
      
      this.onClose(id);
    }

    this.touchStartY = null;
  }

  onClose(id: string) {
    this.toasterService.removeToaster(id);
  }
}
