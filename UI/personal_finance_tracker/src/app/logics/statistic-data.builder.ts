import { computed, Injectable, Signal } from '@angular/core';
import { AggrigateService } from './aggrigate';
import { getExpenseList } from '../stateManagement/selector/expense.selector';

@Injectable({
  providedIn: 'root',
})
export class StatisticDataBuilder {

  private monthMap = new Map<string, number>([
    ['jan', 0], ['feb', 1], ['mar', 2], ['apr', 3], ['may', 4], ['jun', 5],
    ['jul', 6], ['aug', 7], ['sep', 8], ['oct', 9], ['nov', 10], ['dec', 11]
  ]);

  public expense_details: Signal<ExpenseSchema[]> = getExpenseList();
  public expenseInsights:Signal<MonthlyExpenseInsights>;

  private readonly current_fullYear =  new Date().getUTCFullYear();
  private readonly current_month = new Date().getUTCMonth();
  private readonly emptyMonthlyInsights:ExpenseInsightsStatistics; 


  constructor(private aggrigateService:AggrigateService){

    this.emptyMonthlyInsights = this.aggrigateService.getEmptyMonthInsight();

     this.expenseInsights = computed(() => {
      const currentExpenses = this.expense_details();   
      if (!currentExpenses || currentExpenses.length === 0) {
        return this.aggrigateService.calculateExpenseInsights(currentExpenses) || this.emptyMonthlyInsights;
      }
      return this.aggrigateService.calculateExpenseInsights(currentExpenses);
    });
  }


 public getTotalOutFlow(month: Months, ) : StatisticDetail{

   const  utcMonth :number= this.monthMap.get(month) || 0;

   console.log(this.expenseInsights());
   

   const currentMonth_insight = this.expenseInsights()[this.current_fullYear+'-'+utcMonth];
   const lastMonth_insight = this.expenseInsights()[ utcMonth > 0 ? this.current_fullYear+'-'+(utcMonth-1) : this.current_fullYear-1+'-'+11] || this.emptyMonthlyInsights;

   const expense_diff = currentMonth_insight.financialTotals.totalOutflow - lastMonth_insight.financialTotals.totalOutflow
   const perc_diff = (expense_diff / (lastMonth_insight.financialTotals.totalOutflow || expense_diff))*100;

    console.log(lastMonth_insight.financialTotals.totalOutflow);
    
     return {
      title: 'Total Expense',
      note: [{
        value: perc_diff.toString(),
        symbol: '%',
        direction: expense_diff > 0 ? 'increase' : 'decrease',
        sign: expense_diff > 0 ? 'negative' : 'positive',
        description: 'This month',
        graphData: [lastMonth_insight.financialTotals.totalOutflow, currentMonth_insight.financialTotals.totalOutflow]
      }],
      body: {
        currency: 'INR',
        value: currentMonth_insight.financialTotals.totalOutflow.toString(),
        color: '',
        symbol: null
      },
      footer: [{
        value: expense_diff.toString(),
        direction: expense_diff > 0 ? 'increase' : 'decrease',
        sign: expense_diff > 0 ? 'negative' : 'positive',
        description: 'then last month'
      }]
    };


 }


 public getTotalInFlow(month:Months) : StatisticDetail{

   const  utcMonth :number= this.monthMap.get(month) || 0;

   const currentMonth_insight = this.expenseInsights()[this.current_fullYear+'-'+utcMonth];
   const lastMonth_insight = this.expenseInsights()[ utcMonth > 0 ? this.current_fullYear+'-'+(utcMonth-1) : this.current_fullYear-1+'-'+11] || this.emptyMonthlyInsights;

    const earning_diff = currentMonth_insight.financialTotals.totalInflow- lastMonth_insight.financialTotals.totalInflow
    const perc_er_diff = (earning_diff / (lastMonth_insight.financialTotals.totalInflow || earning_diff))*100;

    return {
      title: 'Total Earning',
      note: [{
        value: perc_er_diff.toString(),
        symbol: '%',
        direction: perc_er_diff > 0 ? 'increase' : 'decrease',
        sign: perc_er_diff > 0 ? 'positive' : 'negative',
        description: 'This month',
        graphData: [lastMonth_insight.financialTotals.totalInflow, currentMonth_insight.financialTotals.totalInflow]
      }],
      body: {
        currency: 'INR',
        value: currentMonth_insight.financialTotals.totalInflow.toString(),
        color: 'var(--success-color)',
        symbol: null
      },
      footer: [{
        value: earning_diff.toString(),
        direction: perc_er_diff > 0 ? 'increase' : 'decrease',
        sign: perc_er_diff > 0 ? 'positive' : 'negative',
        description: 'then last month'
      }]
    }

 }

 public getTotalCashFlow(month:Months) : StatisticDetail{

    const  utcMonth :number= this.monthMap.get(month) || 0;

   const currentMonth_insight = this.expenseInsights()[this.current_fullYear+'-'+utcMonth];
   const lastMonth_insight = this.expenseInsights()[ utcMonth > 0 ? this.current_fullYear+'-'+(utcMonth-1) : this.current_fullYear-1+'-'+11] || this.emptyMonthlyInsights;

   const cashflow_diff = currentMonth_insight.financialTotals.netCashFlow- lastMonth_insight.financialTotals.netCashFlow
   const perc_cashflow_diff = (cashflow_diff / (lastMonth_insight.financialTotals.netCashFlow || cashflow_diff))*100;

   return {
      title: 'Net Cash Flow',
      note: [{
        value: perc_cashflow_diff.toString(),
        symbol: '%',
        direction: cashflow_diff > 0 ? 'decrease' : 'increase',
        sign: cashflow_diff > 0 ? 'positive' : 'negative',
        description: 'This month',
        graphData: [lastMonth_insight.financialTotals.netCashFlow, currentMonth_insight.financialTotals.netCashFlow]
      }],
      body: {
        currency: 'INR',
        value: currentMonth_insight.financialTotals.netCashFlow.toString(),
        color: currentMonth_insight.financialTotals.netCashFlow > 0 ? 'var(--success-color)':'var(--error-color)' ,
        symbol: currentMonth_insight.financialTotals.netCashFlow > 0 ? '+' : '-'
      },
      footer: [{
        value: cashflow_diff.toString(),
        direction: perc_cashflow_diff > 0 ? 'increase' : 'decrease',
        sign: cashflow_diff > 0 ? 'positive' : 'negative',
        description: ' then last month'
      }]
    }
 }

 public getMostSpentCategory(month:Months):StatisticDetail{

     const  utcMonth :number= this.monthMap.get(month) || 0;

   const currentMonth_insight = this.expenseInsights()[this.current_fullYear+'-'+utcMonth];
   const lastMonth_insight = this.expenseInsights()[ utcMonth > 0 ? this.current_fullYear+'-'+(utcMonth-1) : this.current_fullYear-1+'-'+11] || this.emptyMonthlyInsights;

    const most_spent = currentMonth_insight.distributions.topCategory;
    const perct_most = most_spent ? (most_spent.amount / (currentMonth_insight.financialTotals.totalOutflow || 1)) * 100 : '';

    return {
      title: 'Most Spent',
      note: [{
        value: perct_most.toString(),
        symbol: '%',
        direction: null,
        sign: 'negative',
        description: 'on total spent',
        graphData:[]
      }],
      body: {
        currency: 'INR',
        value: most_spent ? most_spent.amount.toString() : '',
        color: '' ,
        symbol: null
      },
      footer: [{
        value: most_spent ? most_spent.category.toString() : '',
        direction: null,
        sign: null,
        description:   ''
      }]
    }
 }
}
