// dialog.service.ts
import { Injectable, createComponent, EnvironmentInjector, ApplicationRef, Type, ComponentRef } from '@angular/core';
import { ConfirmationDialog } from '../components/confirmation-dialog/confirmation-dialog';

@Injectable({ providedIn: 'root' })
export class DialogService {
  private dialogRef?: ComponentRef<ConfirmationDialog>;

  constructor(private appRef: ApplicationRef, private injector: EnvironmentInjector) {}

  open(config: DialogConfig) {
    // 1. Create component instance
    this.dialogRef = createComponent(ConfirmationDialog, {
      environmentInjector: this.injector
    });

    // 2. Pass data through Signal
    this.dialogRef.instance.config.set({
      ...config,
      onClose: () => {
        if (config.onClose) config.onClose();
        this.destroy();
      }
    });

    // 3. Attach to DOM
    document.body.appendChild(this.dialogRef.location.nativeElement);
    this.appRef.attachView(this.dialogRef.hostView);
  }

  private destroy() {
    if (this.dialogRef) {
      this.appRef.detachView(this.dialogRef.hostView);
      this.dialogRef.destroy();
    }
  }
}