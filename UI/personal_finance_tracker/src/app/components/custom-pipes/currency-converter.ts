import { Pipe, PipeTransform, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'CurrencyFormatter',
  standalone: true
})
export class SmartCurrencyPipe implements PipeTransform {
  // We inject it here
  private currencyPipe = inject(CurrencyPipe);

  transform(value: string | number, currencyCode: string = 'INR'): string {
    if (!value) return '0';
    
    const input = String(value);
    
    // Regex to separate text from numbers (handles "Shopping2000" or "Rent | 500")
    const match = input.match(/^(.*?)(-?\d+\.?\d*)$/);

    if (match) {
      const label = match[1] // Remove optional pipe chars
      const amount = parseFloat(match[2]);

      const formattedAmount = this.currencyPipe.transform(
        Math.abs(amount), 
        currencyCode, 
        'symbol', 
        '1.2-2'
      );

      return label ? `${label} ${formattedAmount}` : `${formattedAmount}`;
    }

    return input;
  }
}