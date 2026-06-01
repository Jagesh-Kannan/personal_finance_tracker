import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

export type ToasterType = 'success' | 'error' | 'warning' | 'info';
export type ToasterPosition = 'bottom-left' | 'bottom-center' | 'bottom-right' | 'top-left' | 'top-center' | 'top-right';

export interface Toaster {
  id: string;
  message: string;
  type: ToasterType;
  duration?: number;
  header?: string;
}

export interface ToasterConfig {
  position?: ToasterPosition;
  maxToasters?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  private readonly DEFAULT_DURATION = 5000; // 5 seconds
  private readonly MAX_TOASTERS = 3;
  private readonly DEFAULT_POSITION: ToasterPosition = 'bottom-center';

  private toastersSignal = signal<Toaster[]>([]);
  private configSignal = signal<ToasterConfig>({
    position: this.DEFAULT_POSITION,
    maxToasters: this.MAX_TOASTERS
  });

  readonly toasters = this.toastersSignal.asReadonly();
  readonly config = this.configSignal.asReadonly();

  setConfig(config: Partial<ToasterConfig>) {
    this.configSignal.update(current => ({ ...current, ...config }));
  }

  private generateId(): string {
    return `toaster-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private addToaster(toaster: Toaster) {
    const current = this.toastersSignal();
    
    // Check if max toasters reached
    if (current.length >= (this.configSignal().maxToasters || this.MAX_TOASTERS)) {
      // Remove the oldest toaster
      const updated = [...current.slice(1), toaster];
      this.toastersSignal.set(updated);
    } else {
      this.toastersSignal.set([...current, toaster]);
    }

    // Auto-dismiss if duration is set
    const duration = toaster.duration ?? this.DEFAULT_DURATION;
    if (duration > 0) {
      setTimeout(() => this.removeToaster(toaster.id), duration);
    }
  }

  removeToaster(id: string) {
    this.toastersSignal.update(toasters => 
      toasters.filter(t => t.id !== id)
    );
  }

  showSuccess(message: string, header?: string, duration?: number) {
    const toaster: Toaster = {
      id: this.generateId(),
      message,
      type: 'success',
      duration: duration ?? this.DEFAULT_DURATION,
      header
    };
    this.addToaster(toaster);
  }

  showError(message: string, header?: string, duration?: number) {
    const toaster: Toaster = {
      id: this.generateId(),
      message,
      type: 'error',
      duration: duration ?? this.DEFAULT_DURATION,
      header
    };
    this.addToaster(toaster);
  }

  showWarning(message: string, header?: string, duration?: number) {
    const toaster: Toaster = {
      id: this.generateId(),
      message,
      type: 'warning',
      duration: duration ?? this.DEFAULT_DURATION,
      header
    };
    this.addToaster(toaster);
  }

  showInfo(message: string, header?: string, duration?: number) {
    const toaster: Toaster = {
      id: this.generateId(),
      message,
      type: 'info',
      duration: duration ?? this.DEFAULT_DURATION,
      header
    };
    this.addToaster(toaster);
  }

  clear() {
    this.toastersSignal.set([]);
  }
}
