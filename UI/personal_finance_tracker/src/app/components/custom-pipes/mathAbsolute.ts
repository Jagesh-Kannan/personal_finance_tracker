import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abs',
  standalone: true
})
export class AbsolutePipe implements PipeTransform {
  transform(value: number | string): number | string {
    // If it's a number, handle it directly
    if (typeof value === 'number') {
      return Math.abs(value);
    }

    // If it's a string, try to parse it
    const parsed = Number(value);

    // Check if parsing resulted in a real number and not NaN
    // We use isNaN(parsed) and check if the string isn't just empty space
    if (!isNaN(parsed) && isFinite(parsed)) {
      return Math.abs(parsed);
    }

    // If it's words or an invalid number, return the original string
    return value;
  }
}