import { CommonModule } from '@angular/common';
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { GroupListByDatePipe } from '../../custom-pipes/group-list-by-date';

@Component({
  selector: 'app-expense-list-container',
  imports: [CommonModule, GroupListByDatePipe],
  templateUrl: './expense-list-container.html',
  styleUrl: './expense-list-container.css',
})
export class ExpenseListContainer {
   @Input({ required: true }) expenses: any[] | null = [];

  // Captures the custom layout definition provided inside our parent page bodies
  @ContentChild(TemplateRef) itemTemplate!: TemplateRef<any>;
}
