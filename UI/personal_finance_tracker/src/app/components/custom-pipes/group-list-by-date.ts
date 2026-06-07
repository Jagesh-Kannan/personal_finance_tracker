import { Pipe, PipeTransform } from '@angular/core';

export interface DateGroup {
  header: string;
  items: any[];
}

@Pipe({
  name: 'groupListByDate',
  standalone: true
})
export class GroupListByDatePipe implements PipeTransform {
  transform(collection: any[] | null): DateGroup[] {
    if (!collection || collection.length === 0) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const groups: { [key: string]: any[] } = {};
    const order: string[] = [];

    collection.forEach(item => {
      const itemDate = new Date(item.transactionDate);
      itemDate.setHours(0, 0, 0, 0);

      let header = '';

      if (itemDate.getTime() === today.getTime()) {
        header = 'Today';
      } else if (itemDate.getTime() === yesterday.getTime()) {
        header = 'Yesterday';
      } else {
        // Format as 'month-year' (e.g., 'april-2026')
        const month = itemDate.toLocaleString('en-US', { month: 'long' }).toLowerCase();
        const year = itemDate.getFullYear();
        header = `${month}-${year}`;
      }

      if (!groups[header]) {
        groups[header] = [];
        order.push(header); // Preserves chronological sorting
      }
      groups[header].push(item);
    });

    return order.map(header => ({ header, items: groups[header] }));
  }
}
