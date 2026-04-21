import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

export interface ErrorBanner {
  message: string;
  type: 'success'| 'error' | 'info';
  visible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthErrorBannerService {
  private errorBannerSignal = signal<ErrorBanner>({
    message: '',
    type: 'info',
    visible: false
  });

  readonly errorBanner = this.errorBannerSignal.asReadonly();

  showError(message: string, duration?: number ) {
    this.errorBannerSignal.set({
      message,
      type: 'error',
      visible: true
    });

    if (duration && duration > 0) {
      setTimeout(() => this.hideError(), duration);
    }
  }

  showSuccess(message: string, duration?: number ) {
    this.errorBannerSignal.set({
      message,
      type: 'success',
      visible: true
    });

    if (duration && duration > 0) {
      setTimeout(() => this.hideError(), duration);
    }
  }

  showInfo(message: string, duration?: number ) {
    this.errorBannerSignal.set({
      message,
      type: 'info',
      visible: true
    });

    if (duration && duration > 0) {
      setTimeout(() => this.hideError(), duration);
    }
  }

  hideError() {
    this.errorBannerSignal.set({
      message: '',
      type: 'info',
      visible: false
    });
  }
}
