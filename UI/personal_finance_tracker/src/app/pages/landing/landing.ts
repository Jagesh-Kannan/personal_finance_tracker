import { Component } from '@angular/core';
import { Header } from '../../components/header/header';
import { Router } from '@angular/router';
import { ExpenseService } from '../../service/expense.service';
import { Store } from '@ngrx/store';
import { StateDispatch } from '../../service/state-dispatch';

@Component({
  selector: 'app-landing',
  imports: [Header],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {

  constructor(private router: Router, private expenseService: ExpenseService, private stateDispatchService:StateDispatch
  ) {}

  ngOnInit(){

     this.getAllExpenses();
  }

  getAllExpenses(){
      this.expenseService.getAllExpense().subscribe({
      next: (res:any) =>{
        
         this.router.navigate(['/home']);
      },
    })
  }
}
