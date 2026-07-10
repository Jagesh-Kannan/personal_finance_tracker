import { computed, inject, Injectable, Signal } from "@angular/core";
import { AggrigateService } from "./aggrigate";
import { getExpenseList } from "../stateManagement/selector/expense.selector";



@Injectable({
  providedIn: 'root'
})
export class statWidgetDataFilterService {

 

      private monthMap = new Map<string, number>([
    ['jan', 0],
    ['feb', 1],
    ['mar', 2],
    ['apr', 3],
    ['may', 4],
    ['jun', 5],
    ['jul', 6],
    ['aug', 7],
    ['sep', 8],
    ['oct', 9],
    ['nov', 10],
    ['dec', 11],
  ]);

    public expense_details: Signal<ExpenseSchema[]> = getExpenseList();
    private expenseSplitByMonth: Signal<MonthlyExpenseLists>;


  private readonly current_fullYear = new Date().getUTCFullYear();
  private readonly current_month = new Date().getUTCMonth();

  constructor(private aggrigateService:AggrigateService){

    this.expenseSplitByMonth = computed(() => {
       const currentExpenses = this.expense_details();
      if (!currentExpenses || currentExpenses.length === 0) {
        return (
          this.aggrigateService.segregateMonthlyTransactions(currentExpenses) 
        );
      }
      return this.aggrigateService.segregateMonthlyTransactions(currentExpenses);
    })
  }
   

    public getExpense_WidgetDataByMonth(month: Months | null, mode: 'DEBITED' | 'CREDITED', expenses?: ExpenseSchema[]): Omit<WidgetDetails, 'widgetId'> {
    if (month) {
      const utcMonth: number =  this.monthMap.get(month) || 0 ;
      const currentExpenseList = this.expenseSplitByMonth()[this.current_fullYear + '-' + utcMonth];
       return  this.statisticWidgetDataListBuilder(mode, currentExpenseList);
    } else {
      const currentExpense_widList = this.aggrigateService.getWidgetData_Expense(expenses || []);
      return this.statisticWidgetDataListBuilder(mode, currentExpense_widList);
    }
  }

  private statisticWidgetDataListBuilder(mode: 'DEBITED' | 'CREDITED', currentExpenseList: MonthlyTransactionSplit ): Omit<WidgetDetails, 'widgetId'> {

    switch (mode){
      case 'CREDITED' :
        return {
        title: 'Earnings',
        description: 'By mode of payment',
        chartConfig: {
          rawData: currentExpenseList.creditedList,
          chartType: 'pie',
          groupByKey: 'paymentMode',
          valueByKey: 'amount'
        }
      }

      case 'DEBITED' :
        return {
        title: 'Expense',
        description: 'By mode of payment',
        chartConfig: {
          rawData: currentExpenseList.debitedList,
          chartType: 'pie',
          groupByKey: 'paymentMode',
          valueByKey: 'amount'
        }
      }
    }

  }

}
