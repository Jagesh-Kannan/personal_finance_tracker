import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SmartCurrencyPipe } from '../../custom-pipes/currency-converter';
import { AbsolutePipe } from '../../custom-pipes/mathAbsolute';

@Component({
  selector: 'app-expense-list-card',
  imports: [CommonModule, AbsolutePipe, SmartCurrencyPipe],
  templateUrl: './expense-list-card.html',
  styleUrl: './expense-list-card.css',
})
export class ExpenseListCard {
  @Input({ required: true }) expense!: any;
  @Input({ required: true }) avatarText: string = '';
  @Input() isTooltipActive: boolean = false;
  @Output() cardClick = new EventEmitter<MouseEvent>();
}
