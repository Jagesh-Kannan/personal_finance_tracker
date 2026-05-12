import { Component } from '@angular/core';
import { Header } from '../../components/header/header';
import { Router, RouterOutlet  } from "@angular/router";
import { ExpenseService } from '../../service/expense.service';
import { StateDispatch } from '../../service/state-dispatch';
import { getExpenseList } from '../../stateManagement/selector/expense.selector';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [Header, RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  public expenses = getExpenseList();

  constructor(private expenseService: ExpenseService, private stateDispatchService:StateDispatch){}

  async ngOnInit() {
    if (this.expenses().length === 0) {
      await this.getAllExpenses();
    }
  }
  async getAllExpenses(){
    try {
    const res: any = await firstValueFrom(this.expenseService.getAllExpense());
    
    return res.data;
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error; 
  }
  }
}
