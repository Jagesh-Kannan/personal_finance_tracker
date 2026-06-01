

import { Component, inject, computed } from '@angular/core'; // Added computed
import { CommonModule } from '@angular/common';
import { AuthBannerService } from '../../service/auth-banner.service';

@Component({
  selector: 'app-auth-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (bannerState().visible) {
      <!-- Dynamic class based on the type -->
      <div class="error-banner" [ngClass]="bannerState().type || 'error'">
        <div class="error-content">
          <svg class="error-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             @switch (bannerState().type) {
              @case ('success') {
                <!-- Check Circle Icon -->
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              }
              @case ('info') {
                <!-- Info Icon -->
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              }
              @default {
                <!-- Alert Circle (Error) Icon -->
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              }
            }
          </svg>
          <span class="error-message">{{ bannerState().message }}</span>
        </div>
        <button class="close-btn" (click)="onClose()" aria-label="Close error banner">
          ×
        </button>
      </div>
    }
  `,
  styles: [`
    .error-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: white;
      padding: 12px 16px;
      border-radius: 6px;
      margin-bottom: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      animation: slideDown 0.3s ease-in-out;
      transition: background-color 0.3s ease;
    }

    /* Color Variants */
    .error-banner.error { background-color: #e23035; }
    .error-banner.success { background-color: #2e7d32; }
    .error-banner.info { background-color: #f9a825; }

    .error-content { display: flex; align-items: center; gap: 12px; flex: 1; }
    .error-icon { flex-shrink: 0; color: white; }
    .error-message { font-size: 14px; font-weight: 500; line-height: 1.5; }
    .close-btn { background: none; border: none; color: white; font-size: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; height: 24px; width: 24px; transition: opacity 0.2s; }
    .close-btn:hover { opacity: 0.8; }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class AuthNotifyBannerComponent {
  private readonly errorBannerService = inject(AuthBannerService);
  
  // Create a computed signal for easier template access
  readonly bannerState = computed(() => this.errorBannerService.errorBanner());

  onClose() {
    this.errorBannerService.hideError();
  }
}