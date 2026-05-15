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
    
    // 1. Quick shortcut for standalone mathematical zero strings
    if (input === '0') {
      const fallbackZero = this.currencyPipe.transform(0, currencyCode, 'symbol', '1.2-2');
      return fallbackZero || '0.00';
    }

    // 2. UPDATED REGEX: Matches ONLY raw numbers (optional minus sign, commas, digits, optional decimal)
    // Examples it WILL match: "2000", "-500", "1250.50", "33"
    // Examples it WILL IGNORE: "Shopping2000", "Rent | 500", "abc#123", "12-05-2026"
    const strictNumericPattern = /^-?[\d,]+(?:\.\d+)?$/;

    if (strictNumericPattern.test(input)) {
      // Clean up commas if they exist in the raw string before parsing to float
      const cleanNumericString = input.replace(/,/g, '');
      const amount = parseFloat(cleanNumericString);
      
      // We pass the raw amount without Math.abs() to preserve negative signs (e.g. -33 -> -₹33.00)
      let formattedAmount = this.currencyPipe.transform(
        amount, 
        currencyCode, 
        'symbol', 
        '1.2-2'
      );

      if (!formattedAmount) {
        formattedAmount = '0.00';
      }

      return formattedAmount;
    }
    
    // 3. Fallback: If it contains letters, spaces, or special characters, return it exactly as it is
    return input;
  }
}