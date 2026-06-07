import { Injectable, Signal } from '@angular/core';
import { getExpenseList } from '../stateManagement/selector/expense.selector';

@Injectable({
  providedIn: 'root',
})
export class AggrigateService {

  private  expensesList:Signal<ExpenseSchema[]> = getExpenseList();

  /**
   * Generically groups and aggregates expense data by any provided key.
   */
  public getAggregateByKey<K extends keyof ExpenseSchema>(
    key: K,
    data: ExpenseSchema[] = this.expensesList()
  ): AggregationResult {
    return data.reduce((acc, currentItem) => {
      // Safely extract group value as string (e.g., "UPI" or "Shopping")
      const groupValue = String(currentItem[key] ?? 'Unknown');
      const amount = Number(currentItem.amount) || 0;

      if (!acc[groupValue]) {
        acc[groupValue] = { totalAmount: 0, transactionCount: 0 };
      }

      acc[groupValue].totalAmount += amount;
      acc[groupValue].transactionCount += 1;

      return acc;
    }, {} as AggregationResult);
  }

 /**
   * Calculates total stats for a strictly typed specific month and year.
   */
  public aggregateByMonth(
    month: Months,
    year: number,
    data: ExpenseSchema[] = this.expensesList()
  ): AggregatedStat {

    return data
      .filter(item => {
        const date = new Date(item.transactionDate);
        const itemMonth = date.toLocaleString('default', { month: 'short' }) as Months;
        
        // Match both month name and specific year
        return itemMonth.toLocaleLowerCase() === month.toLocaleLowerCase() && date.getFullYear() === year;
      })
      .reduce((acc, item) => {
        acc.totalAmount += Number(item.amount) || 0;
        acc.transactionCount += 1;
        return acc;
      }, { totalAmount: 0, transactionCount: 0 } as AggregatedStat);
  }

  public  calculateMonthlyExpenseInsights(data: ExpenseSchema[] = this.expensesList()): MonthlyExpenseInsights {
    const monthlyData: MonthlyExpenseInsights = {};

    if (!data || data.length === 0) return monthlyData;

    data.forEach(record => {
      // 1. Extract clean Year-Month key "YYYY-MM"
     const recDate = new Date(record.transactionDate);
      const year = recDate.getUTCFullYear();
      const _month = String(recDate.getUTCMonth());
      const yearMonth = `${year}-${_month}`;

      // 2. Initialize month object if it doesn't exist
      if (!monthlyData[yearMonth]) {
        monthlyData[yearMonth] = this.getEmptyMonthInsight();
      }

      const month = monthlyData[yearMonth];
      const amount = record.amount;

      // 3. Increment baseline totals
      month.behavioral.totalTransactions += 1;
      
      // Calculate payment modes frequency
      month.distributions.byPaymentMode[record.paymentMode] = 
        (month.distributions.byPaymentMode[record.paymentMode] || 0) + 1;

      // 4. Mode-specific calculations (DEBITED vs CREDITED)
      if (record.mode === 'DEBITED') {
        month.financialTotals.totalOutflow += amount;

        // Track highest purchase
        if (amount > month.behavioral.highestSinglePurchase) {
          month.behavioral.highestSinglePurchase = amount;
        }

        // Aggregate categories
        month.distributions.byCategory[record.expenseCategory] = 
          (month.distributions.byCategory[record.expenseCategory] || 0) + amount;

        // Aggregate custom groups
        if (record.customGrouping) {
          month.distributions.byCustomGroup[record.customGrouping] = 
            (month.distributions.byCustomGroup[record.customGrouping] || 0) + amount;
        }
      } else if (record.mode === 'CREDITED') {
        month.financialTotals.totalInflow += amount;
      }
    });

    // 5. Final pass to calculate averages and "Tops" for each month
    Object.keys(monthlyData).forEach(key => {
      const month = monthlyData[key];
      
      month.financialTotals.netCashFlow = month.financialTotals.totalInflow - month.financialTotals.totalOutflow;

      // Calculate averages strictly against transactions present
      if (month.behavioral.totalTransactions > 0) {
        month.behavioral.averageTransactionValue = 
          month.financialTotals.totalOutflow / month.behavioral.totalTransactions;
      }

      // Determine top category
      const topCat = this.getMaxKeyFromMap(month.distributions.byCategory);
      month.distributions.topCategory = topCat ? { category: topCat, amount: month.distributions.byCategory[topCat] } : null;

      // Determine preferred payment mode
      const topPay = this.getMaxKeyFromMap(month.distributions.byPaymentMode);
      month.distributions.preferredPaymentMode = topPay ? { mode: topPay, count: month.distributions.byPaymentMode[topPay] } : null;
    });

    return monthlyData;
  }

  public calculateExpenseInsights(data: ExpenseSchema[] = this.expensesList()): ExpenseInsightsStatistics {
    const insights = this.getEmptyMonthInsight();

    if (!data || data.length === 0) return insights;

    // 1. Aggregate all expenses regardless of month
    data.forEach(record => {
      const amount = record.amount;

      // Increment baseline totals
      insights.behavioral.totalTransactions += 1;
      
      // Calculate payment modes frequency
      insights.distributions.byPaymentMode[record.paymentMode] = 
        (insights.distributions.byPaymentMode[record.paymentMode] || 0) + 1;

      // 2. Mode-specific calculations (DEBITED vs CREDITED)
      if (record.mode === 'DEBITED') {
        insights.financialTotals.totalOutflow += amount;

        // Track highest purchase
        if (amount > insights.behavioral.highestSinglePurchase) {
          insights.behavioral.highestSinglePurchase = amount;
        }

        // Aggregate categories
        insights.distributions.byCategory[record.expenseCategory] = 
          (insights.distributions.byCategory[record.expenseCategory] || 0) + amount;

        // Aggregate custom groups
        if (record.customGrouping) {
          insights.distributions.byCustomGroup[record.customGrouping] = 
            (insights.distributions.byCustomGroup[record.customGrouping] || 0) + amount;
        }
      } else if (record.mode === 'CREDITED') {
        insights.financialTotals.totalInflow += amount;
      }
    });

    // 3. Calculate final metrics
    insights.financialTotals.netCashFlow = insights.financialTotals.totalInflow - insights.financialTotals.totalOutflow;

    // Calculate averages strictly against transactions present
    if (insights.behavioral.totalTransactions > 0) {
      insights.behavioral.averageTransactionValue = 
        insights.financialTotals.totalOutflow / insights.behavioral.totalTransactions;
    }

    // Determine top category
    const topCat = this.getMaxKeyFromMap(insights.distributions.byCategory);
    insights.distributions.topCategory = topCat ? { category: topCat, amount: insights.distributions.byCategory[topCat] } : null;

    // Determine preferred payment mode
    const topPay = this.getMaxKeyFromMap(insights.distributions.byPaymentMode);
    insights.distributions.preferredPaymentMode = topPay ? { mode: topPay, count: insights.distributions.byPaymentMode[topPay] } : null;

    return insights;
  }
  // Helper to find key with max value in a hashmap
  private  getMaxKeyFromMap(map: Record<string, number>): string | null {
    const keys = Object.keys(map);
    if (keys.length === 0) return null;
    return keys.reduce((a, b) => (map[a] > map[b] ? a : b));
  }

  // Fallback state
  public getEmptyMonthInsight(): ExpenseInsightsStatistics {
    return {
      financialTotals: { totalOutflow: 0, totalInflow: 0, netCashFlow: 0 },
      behavioral: { highestSinglePurchase: 0, averageTransactionValue: 0, totalTransactions: 0 },
      distributions: { byCategory: {}, byPaymentMode: {}, byCustomGroup: {}, topCategory: null, preferredPaymentMode: null }
    };
  }
}

