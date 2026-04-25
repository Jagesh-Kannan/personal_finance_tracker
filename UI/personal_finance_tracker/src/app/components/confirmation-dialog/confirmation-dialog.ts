import { CommonModule } from '@angular/common';
import { Component, signal, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './confirmation-dialog.html',
  styleUrl: './confirmation-dialog.css',
})
export class ConfirmationDialog {

  config = signal<DialogConfig>({});
  
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
