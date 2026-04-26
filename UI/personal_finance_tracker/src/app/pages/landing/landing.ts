import { Component } from '@angular/core';
import { Header } from '../../components/header/header';
import { Router } from '@angular/router';
import { ExpenseService } from '../../service/expense.service';
import { Store } from '@ngrx/store';
import { ExpenseActions } from '../../stateManagement/action/expense.action';

@Component({
  selector: 'app-landing',
  imports: [Header],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {

  constructor(private router: Router, private expenseService: ExpenseService, private store:Store) {}

  ngOnInit(){
     this.getAllExpenses();
  }

  getAllExpenses(){
      this.expenseService.getAllExpense().subscribe({
      next: (res:any) =>{
          this.store.dispatch(ExpenseActions.storeNewExpenses({expenses:res.data}))
         this.router.navigate(['/home']);
      },
    })
  }
}
