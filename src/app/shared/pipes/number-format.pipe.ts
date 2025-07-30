import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat',
  standalone: true
})
export class NumberFormatPipe implements PipeTransform {
  transform(value: number | string, decimals?: number): string {
    if (value === null || value === undefined) return '0';

    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numValue)) return '0';

    const options: Intl.NumberFormatOptions = {
      minimumFractionDigits: decimals ?? 0,
      maximumFractionDigits: decimals ?? 0
    };

    return new Intl.NumberFormat('en-US', options).format(numValue);
  }
}
