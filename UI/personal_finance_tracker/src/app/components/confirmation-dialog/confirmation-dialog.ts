import { CommonModule } from '@angular/common';
import { Component, signal, TemplateRef } from '@angular/core';
import { LucideX } from '@lucide/angular';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [CommonModule, LucideX],
  standalone: true,
  templateUrl: './confirmation-dialog.html',
  styleUrl: './confirmation-dialog.css',
})
export class ConfirmationDialog {

  config = signal<DialogConfig>({});

  templateValue = () => this.config().template;
  templateContext = () => this.config().templateContext ?? {};
  
  leftActions = () => this.config().actions?.filter(a => a.position === 'right') || [];
  rightActions = () => this.config().actions?.filter(a => a.position === 'left') || [];

  handleAction(action: DialogAction) {
    action.callback();
    this.close();
  }

  close() {
    if (this.config().onClose) this.config().onClose!();
    // Logic to destroy component handled by service
  }
}
