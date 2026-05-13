import { Pipe, PipeTransform, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'CurrencyFormatter',
  standalone: true
})
export class SmartCurrencyPipe implements PipeTransform {
  private currencyPipe = inject(CurrencyPipe);

  transform(value: string | number, currencyCode: string = 'INR'): string {
    const input = String(value).trim();
    
    // Quick shortcut for standalone '0' strings to bypass complex regex lookups
    if (input === '0') {
      const fallbackZero = this.currencyPipe.transform(0, currencyCode, 'symbol', '1.2-2');
      return fallbackZero || '0.00';
    }

    // Regex to separate text from numbers (handles "Shopping2000" or "Rent | 500")
    const match = input.match(/^(.*?)(-?\d+\.?\d*)$/);
    
    if (match) {
      const label = match[1].trim();
      const amount = parseFloat(match[2]);
      
      // Calculate formatted layout
      let formattedAmount = this.currencyPipe.transform(
        Math.abs(amount), 
        currencyCode, 
        'symbol', 
        '1.2-2'
      );

      // FIX BUG HERE: Fallback to static zero if the built-in pipe fails or outputs null
      if (!formattedAmount) {
        formattedAmount = '0.00';
      }

      return label ? `${label} ${formattedAmount}` : `${formattedAmount}`;
    }
    
    return input;
  }
}