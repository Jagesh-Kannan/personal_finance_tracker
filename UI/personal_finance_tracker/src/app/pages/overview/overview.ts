import { Component, computed, Signal, signal, WritableSignal } from '@angular/core';
import { getUser } from '../../stateManagement/selector/user.selector';
import { StatisticBlock } from '../../components/statistics/statistic-block/statistic-block';
import { getExpenseList } from '../../stateManagement/selector/expense.selector';
import { AggrigateService } from '../../logics/aggrigate';

@Component({
  selector: 'app-overview',
  imports: [ StatisticBlock],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
})
export class Overview {

  public statisticsDetails = signal<StatisticDetail[]>([]);

  public user_detail: Signal<UserState> = getUser();
  public expense_details: Signal<ExpenseSchema[]> = getExpenseList();

  private expenseInsights:Signal<MonthlyExpenseInsights>;

  constructor(private aggrigateService:AggrigateService) {
     this.expenseInsights = computed(() =>this.aggrigateService.calculateExpenseInsights());
  }

  ngOnInit(){

    console.log(this.expense_details().filter(d=>d.mode==='CREDITED'));
    console.log(this.expenseInsights());
    
    

   let fullYear = new Date().getUTCFullYear();
   let month = new Date().getUTCMonth();
   let pre_month = month-1
   const currentMonth_insight = this.expenseInsights()[fullYear+'-'+month];
   const lastMonth_insight = this.expenseInsights()[fullYear+'-'+pre_month];

   const expense_diff = currentMonth_insight.financialTotals.totalOutflow- lastMonth_insight.financialTotals.totalOutflow
   const perc_diff = (expense_diff / lastMonth_insight.financialTotals.totalOutflow)*100;

   const statistic1:StatisticDetail = {
      title: 'Total Expense',
      note: [{
        value: perc_diff.toString(),
        symbol: '%',
        direction: expense_diff > 0 ? 'increase' : 'decrease',
        sign: expense_diff > 0 ? 'negative' : 'positive',
        description: 'This month'
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


   const earning_diff = currentMonth_insight.financialTotals.totalInflow- lastMonth_insight.financialTotals.totalInflow
   const perc_er_diff = (earning_diff / lastMonth_insight.financialTotals.totalInflow)*100;

     const statistic2:StatisticDetail = {
      title: 'Total Earning',
      note: [{
        value: perc_er_diff.toString(),
        symbol: '%',
        direction: perc_er_diff > 0 ? 'increase' : 'decrease',
        sign: perc_er_diff > 0 ? 'positive' : 'negative',
        description: 'This month'
      }],
      body: {
        currency: 'INR',
        value: currentMonth_insight.financialTotals.totalInflow.toString(),
        color: '#1bc738',
        symbol: null
      },
      footer: [{
        value: earning_diff.toString(),
        direction: perc_er_diff > 0 ? 'increase' : 'decrease',
        sign: perc_er_diff > 0 ? 'positive' : 'negative',
        description: 'then last month'
      }]
    };


   const cashflow_diff = currentMonth_insight.financialTotals.netCashFlow- lastMonth_insight.financialTotals.netCashFlow
   const perc_cashflow_diff = (cashflow_diff / lastMonth_insight.financialTotals.netCashFlow)*100;


    const statistic3:StatisticDetail = {
      title: 'Net Cash Flow',
      note: [{
        value: perc_cashflow_diff.toString(),
        symbol: '%',
        direction: cashflow_diff > 0 ? 'decrease' : 'increase',
        sign: cashflow_diff > 0 ? 'positive' : 'negative',
        description: 'This month'
      }],
      body: {
        currency: 'INR',
        value: currentMonth_insight.financialTotals.netCashFlow.toString(),
        color: currentMonth_insight.financialTotals.netCashFlow > 0 ? 'rgb(27, 199, 56)':'var(--error-color)' ,
        symbol: currentMonth_insight.financialTotals.netCashFlow > 0 ? '+' : '-'
      },
      footer: [{
        value: cashflow_diff.toString(),
        direction: null,
        sign: cashflow_diff > 0 ? 'positive' : 'negative',
        description: 'less then last month'
      }]
    };


    const most_spent = currentMonth_insight.distributions.topCategory;
    const perct_most = most_spent ? (most_spent.amount / currentMonth_insight.financialTotals.totalOutflow) * 100 : '';

     const statistic4:StatisticDetail = {
      title: 'Most Spent',
      note: [{
        value: perct_most.toString(),
        symbol: '%',
        direction: null,
        sign: 'negative',
        description: 'on total spent'
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
    };

    this.statisticsDetails.update(current=> [...current, statistic1, statistic2, statistic3, statistic4])

 }
}




























// {
//    // 1. References to the HTML elements
//   barContainer = viewChild<ElementRef>('barContainer');
//   pieContainer = viewChild<ElementRef>('pieContainer');
  
//   // 2. Chart Instances
//   private barChart?: echarts.ECharts;
//   private pieChart?: echarts.ECharts;

//   // 3. Input Data (The 40 objects generated previously)
//   expenses = input<any[]>([
//   {
//     "expenseName": "Grocery Shopping",
//     "expenseCategory": "Food & Dining",
//     "amount": 3282,
//     "paymentMode": "UPI",
//     "mode": "DEBITED",
//     "notes": "Weekly vegetables and fruits",
//     "currency": "INR",
//     "customGrouping": "November-2025-Food"
//   },
//   {
//     "expenseName": "Netflix Subscription",
//     "expenseCategory": "Entertainment",
//     "amount": 499,
//     "paymentMode": "CREDIT CARD",
//     "mode": "DEBITED",
//     "notes": "Monthly premium plan",
//     "currency": "INR",
//     "customGrouping": "November-2025-Entertainment"
//   },
//   {
//     "expenseName": "Gym Membership",
//     "expenseCategory": "Health",
//     "amount": 1500,
//     "paymentMode": "CASH",
//     "mode": "DEBITED",
//     "notes": "Monthly gym fee",
//     "currency": "INR",
//     "customGrouping": "November-2025-Health"
//   },
//   {
//     "expenseName": "Internet Bill",
//     "expenseCategory": "Utilities",
//     "amount": 999,
//     "paymentMode": "BANK_TRANSFER",
//     "mode": "DEBITED",
//     "notes": "Fiber broadband",
//     "currency": "INR",
//     "customGrouping": "December-2025-Utilities"
//   },
//   {
//     "expenseName": "Office Lunch",
//     "expenseCategory": "Food & Dining",
//     "amount": 450,
//     "paymentMode": "WALLET",
//     "mode": "DEBITED",
//     "notes": "Team lunch",
//     "currency": "INR",
//     "customGrouping": "November-2025-Food"
//   },
//   {
//     "expenseName": "Home Rent",
//     "expenseCategory": "Rent",
//     "amount": 25000,
//     "paymentMode": "CHEQUE",
//     "mode": "DEBITED",
//     "notes": "December rent",
//     "currency": "INR",
//     "customGrouping": "December-2025-Rent"
//   },
//   {
//     "expenseName": "Uber Ride",
//     "expenseCategory": "Transport",
//     "amount": 350,
//     "paymentMode": "UPI",
//     "mode": "DEBITED",
//     "notes": "Commute to office",
//     "currency": "INR",
//     "customGrouping": "November-2025-Transport"
//   },
//   {
//     "expenseName": "Zomato Order",
//     "expenseCategory": "Food & Dining",
//     "amount": 650,
//     "paymentMode": "CREDIT CARD",
//     "mode": "DEBITED",
//     "notes": "Dinner order",
//     "currency": "INR",
//     "customGrouping": "November-2025-Food"
//   },
//   {
//     "expenseName": "Pharmacy",
//     "expenseCategory": "Health",
//     "amount": 1200,
//     "paymentMode": "CASH",
//     "mode": "DEBITED",
//     "notes": "Regular medications",
//     "currency": "INR",
//     "customGrouping": "December-2025-Health"
//   },
//   {
//     "expenseName": "Mobile Recharge",
//     "expenseCategory": "Utilities",
//     "amount": 799,
//     "paymentMode": "WALLET",
//     "mode": "DEBITED",
//     "notes": "Prepaid plan",
//     "currency": "INR",
//     "customGrouping": "November-2025-Utilities"
//   },
//   {
//     "expenseName": "Electricity Bill",
//     "expenseCategory": "Utilities",
//     "amount": 2800,
//     "paymentMode": "BANK_TRANSFER",
//     "mode": "DEBITED",
//     "notes": "Monthly power bill",
//     "currency": "INR",
//     "customGrouping": "December-2025-Utilities"
//   },
//   {
//     "expenseName": "New Shoes",
//     "expenseCategory": "Shopping",
//     "amount": 4500,
//     "paymentMode": "DEBIT CARD",
//     "mode": "DEBITED",
//     "notes": "Running shoes",
//     "currency": "INR",
//     "customGrouping": "November-2025-Shopping"
//   },
//   {
//     "expenseName": "Movie Tickets",
//     "expenseCategory": "Entertainment",
//     "amount": 800,
//     "paymentMode": "UPI",
//     "mode": "DEBITED",
//     "notes": "Weekend movie",
//     "currency": "INR",
//     "customGrouping": "December-2025-Entertainment"
//   },
//   {
//     "expenseName": "Freelance Payment",
//     "expenseCategory": "Income",
//     "amount": 15000,
//     "paymentMode": "BANK_TRANSFER",
//     "mode": "CREDITED",
//     "notes": "Website design project",
//     "currency": "INR",
//     "customGrouping": "November-2025-Income"
//   },
//   {
//     "expenseName": "Coffee",
//     "expenseCategory": "Food & Dining",
//     "amount": 250,
//     "paymentMode": "CASH",
//     "mode": "DEBITED",
//     "notes": "Starbucks visit",
//     "currency": "INR",
//     "customGrouping": "December-2025-Food"
//   },
//   {
//     "expenseName": "Gas Cylinder",
//     "expenseCategory": "Utilities",
//     "amount": 1100,
//     "paymentMode": "UPI",
//     "mode": "DEBITED",
//     "notes": "LPG refill",
//     "currency": "INR",
//     "customGrouping": "November-2025-Utilities"
//   },
//   {
//     "expenseName": "Car Service",
//     "expenseCategory": "Transport",
//     "amount": 8500,
//     "paymentMode": "CREDIT CARD",
//     "mode": "DEBITED",
//     "notes": "Annual maintenance",
//     "currency": "INR",
//     "customGrouping": "December-2025-Transport"
//   },
//   {
//     "expenseName": "Gift for Friend",
//     "expenseCategory": "Gifts",
//     "amount": 2000,
//     "paymentMode": "WALLET",
//     "mode": "DEBITED",
//     "notes": "Birthday gift",
//     "currency": "INR",
//     "customGrouping": "November-2025-Gifts"
//   },
//   {
//     "expenseName": "Amazon Prime",
//     "expenseCategory": "Entertainment",
//     "amount": 1499,
//     "paymentMode": "CREDIT CARD",
//     "mode": "DEBITED",
//     "notes": "Annual membership",
//     "currency": "INR",
//     "customGrouping": "December-2025-Entertainment"
//   },
//   {
//     "expenseName": "Milk Delivery",
//     "expenseCategory": "Food & Dining",
//     "amount": 1800,
//     "paymentMode": "CASH",
//     "mode": "DEBITED",
//     "notes": "Monthly milk bill",
//     "currency": "INR",
//     "customGrouping": "November-2025-Food"
//   },
//   {
//     "expenseName": "Flight Ticket",
//     "expenseCategory": "Transport",
//     "amount": 12000,
//     "paymentMode": "BANK_TRANSFER",
//     "mode": "DEBITED",
//     "notes": "Holiday trip",
//     "currency": "INR",
//     "customGrouping": "December-2025-Transport"
//   },
//   {
//     "expenseName": "House Help Salary",
//     "expenseCategory": "Rent",
//     "amount": 6000,
//     "paymentMode": "CASH",
//     "mode": "DEBITED",
//     "notes": "Monthly salary",
//     "currency": "INR",
//     "customGrouping": "November-2025-Rent"
//   },
//   {
//     "expenseName": "Stationery",
//     "expenseCategory": "Education",
//     "amount": 400,
//     "paymentMode": "UPI",
//     "mode": "DEBITED",
//     "notes": "Office supplies",
//     "currency": "INR",
//     "customGrouping": "December-2025-Education"
//   },
//   {
//     "expenseName": "Tuition Fee",
//     "expenseCategory": "Education",
//     "amount": 5000,
//     "paymentMode": "CHEQUE",
//     "mode": "DEBITED",
//     "notes": "Quarterly fees",
//     "currency": "INR",
//     "customGrouping": "November-2025-Education"
//   },
//   {
//     "expenseName": "New T-shirt",
//     "expenseCategory": "Shopping",
//     "amount": 1200,
//     "paymentMode": "WALLET",
//     "mode": "DEBITED",
//     "notes": "Myntra sale",
//     "currency": "INR",
//     "customGrouping": "December-2025-Shopping"
//   },
//   {
//     "expenseName": "Fruit Purchase",
//     "expenseCategory": "Food & Dining",
//     "amount": 300,
//     "paymentMode": "CASH",
//     "mode": "DEBITED",
//     "notes": "Street vendor",
//     "currency": "INR",
//     "customGrouping": "November-2025-Food"
//   },
//   {
//     "expenseName": "Hospital Bill",
//     "expenseCategory": "Health",
//     "amount": 15000,
//     "paymentMode": "DEBIT CARD",
//     "mode": "DEBITED",
//     "notes": "Minor surgery",
//     "currency": "INR",
//     "customGrouping": "December-2025-Health"
//   },
//   {
//     "expenseName": "Book Purchase",
//     "expenseCategory": "Education",
//     "amount": 750,
//     "paymentMode": "UPI",
//     "mode": "DEBITED",
//     "notes": "Programming book",
//     "currency": "INR",
//     "customGrouping": "November-2025-Education"
//   },
//   {
//     "expenseName": "Restaurant Dinner",
//     "expenseCategory": "Food & Dining",
//     "amount": 3500,
//     "paymentMode": "CREDIT CARD",
//     "mode": "DEBITED",
//     "notes": "Family dinner",
//     "currency": "INR",
//     "customGrouping": "December-2025-Food"
//   },
//   {
//     "expenseName": "Bus Ticket",
//     "expenseCategory": "Transport",
//     "amount": 150,
//     "paymentMode": "CASH",
//     "mode": "DEBITED",
//     "notes": "Local travel",
//     "currency": "INR",
//     "customGrouping": "November-2025-Transport"
//   },
//   {
//     "expenseName": "Video Game",
//     "expenseCategory": "Entertainment",
//     "amount": 3999,
//     "paymentMode": "WALLET",
//     "mode": "DEBITED",
//     "notes": "Steam purchase",
//     "currency": "INR",
//     "customGrouping": "December-2025-Entertainment"
//   },
//   {
//     "expenseName": "Society Maintenance",
//     "expenseCategory": "Rent",
//     "amount": 4500,
//     "paymentMode": "BANK_TRANSFER",
//     "mode": "DEBITED",
//     "notes": "Quarterly maintenance",
//     "currency": "INR",
//     "customGrouping": "November-2025-Rent"
//   },
//   {
//     "expenseName": "Yoga Class",
//     "expenseCategory": "Health",
//     "amount": 2500,
//     "paymentMode": "UPI",
//     "mode": "DEBITED",
//     "notes": "Monthly fee",
//     "currency": "INR",
//     "customGrouping": "December-2025-Health"
//   },
//   {
//     "expenseName": "Pet Food",
//     "expenseCategory": "Shopping",
//     "amount": 3200,
//     "paymentMode": "CREDIT CARD",
//     "mode": "DEBITED",
//     "notes": "Dog food refill",
//     "currency": "INR",
//     "customGrouping": "November-2025-Shopping"
//   },
//   {
//     "expenseName": "Charity Donation",
//     "expenseCategory": "Gifts",
//     "amount": 1000,
//     "paymentMode": "UPI",
//     "mode": "DEBITED",
//     "notes": "NGO donation",
//     "currency": "INR",
//     "customGrouping": "December-2025-Gifts"
//   },
//   {
//     "expenseName": "Laundry Bill",
//     "expenseCategory": "Utilities",
//     "amount": 600,
//     "paymentMode": "CASH",
//     "mode": "DEBITED",
//     "notes": "Dry cleaning",
//     "currency": "INR",
//     "customGrouping": "November-2025-Utilities"
//   },
//   {
//     "expenseName": "Water Bill",
//     "expenseCategory": "Utilities",
//     "amount": 450,
//     "paymentMode": "UPI",
//     "mode": "DEBITED",
//     "notes": "Monthly water usage",
//     "currency": "INR",
//     "customGrouping": "December-2025-Utilities"
//   },
//   {
//     "expenseName": "Keyboard",
//     "expenseCategory": "Shopping",
//     "amount": 2200,
//     "paymentMode": "DEBIT CARD",
//     "mode": "DEBITED",
//     "notes": "Mechanical keyboard",
//     "currency": "INR",
//     "customGrouping": "November-2025-Shopping"
//   },
//   {
//     "expenseName": "Parking Fee",
//     "expenseCategory": "Transport",
//     "amount": 100,
//     "paymentMode": "CASH",
//     "mode": "DEBITED",
//     "notes": "Mall parking",
//     "currency": "INR",
//     "customGrouping": "December-2025-Transport"
//   },
//   {
//     "expenseName": "Laptop Repair",
//     "expenseCategory": "Education",
//     "amount": 4500,
//     "paymentMode": "UPI",
//     "mode": "DEBITED",
//     "notes": "Screen replacement",
//     "currency": "INR",
//     "customGrouping": "November-2025-Education"
//   }
// ]
// );

//   constructor() {
//     // 4. Update charts whenever data changes
//     effect(() => {
//   const data = this.expenses();
//   // Only update if the charts are actually initialized
//   if (this.barChart && this.pieChart) {
//     this.updateCharts(data);
//   }
// });
//   }

// ngAfterViewInit() {
//     echarts.registerTransform(aggregate as any);
//   this.barChart = echarts.init(this.barContainer()?.nativeElement);
//   this.pieChart = echarts.init(this.pieContainer()?.nativeElement);
  
//   // Manually trigger the first render once containers are ready
//   this.updateCharts(this.expenses());
  
//   window.addEventListener('resize', this.onResize);
// }

//   updateCharts(data: any[]) {
//     if (!this.barChart || !this.pieChart) return;

//     // 6. SHARED DATASET: Use the same array for both
//     const dataset = { source: data };

//     // --- FORM 1: BAR CHART ---
//    this.barChart.setOption({
//   dataset: [
//     { 
//       source: data,
//        sourceHeader: false,
//       dimensions: ['expenseName', 'expenseCategory', 'amount', 'paymentMode', 'mode', 'notes', 'currency', 'customGrouping']
//      },
//     {
//       transform: [
//         {
//           type: 'ecSimpleTransform:aggregate',
//           config: {
//              fromDatasetIndex: 0,
//             groupBy: 'expenseCategory',
//             resultDimensions: [
//               { from: 'expenseCategory', name: 'expenseCategory' },
//               { from: 'amount', method: 'sum', name: 'totalAmount' }
//             ]
//           }
//         }
//       ]
//     }
//   ],
//   tooltip: { trigger: 'axis' },
//   xAxis: { 
//     type: 'category', 
//     axisLabel: { 
//       interval: 0,
//       rotate: 30
//     } 
//   },
//   yAxis: {},
//   series: [{
//     type: 'bar',
//     datasetIndex: 1,
//     encode: { x: 'expenseCategory', y: 'totalAmount' }
//   }]
// });

//     // --- FORM 2: PIE CHART ---
//     this.pieChart.setOption({
//       dataset: dataset,
//       tooltip: { trigger: 'item' },
//       series: [{
//         type: 'pie',
//         radius: '50%',
//         encode: { itemName: 'expenseName', value: 'amount' }
//       }]
//     });

//     console.log(this.barChart.getOption());
//   }

//   onResize = () => {
//     this.barChart?.resize();
//     this.pieChart?.resize();
//   }

//   ngOnDestroy() {
//     // 7. DISPOSE: Release resources to avoid memory leaks
//     window.removeEventListener('resize', this.onResize);
//     this.barChart?.dispose();
//     this.pieChart?.dispose();
//   }
// }


