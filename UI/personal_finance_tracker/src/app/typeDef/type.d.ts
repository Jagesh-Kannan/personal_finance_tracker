type LoginDetails = {
  email: string;
  password: string;
};

type RegisterDetails = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirm: string;
};

type ResetPasswordDetails = {
  password: string;
  passwordConfirm: string;
};

type userInfoResponse = {
    status: string;
    user: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        emailVerified: boolean;
        __v: number;
    }
}

type userInfo = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    emailVerified: boolean;
};

type DialogAction = {
  label: string;
  callback: () => void;
  position: 'left' | 'right';
  class?: string;
};

type DialogConfig = {
  title?: string;
  message?: string;
  template?: any; // To accept HTML/TemplateRef
  actions?: DialogAction[];
  onClose?: () => void;
};

type ExpenseSchema = {
  _id: string;
  expenseName: string;
  expenseCategory: string; // or 'Food & Dining' | 'Rent' | etc.
  amount: number;
  userId:  string;
  paymentMode: 'CASH','CREDIT CARD','DEBIT CARD','UPI','WALLET','BANK_TRANSFER','CHEQUE'; 
  mode: 'DEBITED' | 'CREDITED';
  senderOrReceiver: string,
  transactionDate: string;
  notes: string;
  currency: string;
  customGrouping: string;
  __v: number;
  createdAt:  string;
   updatedAt:  string;
};

type FilterableExpenseSchema = ExpenseSchema &{
   isRemoved: boolean;
};

type ExtractedExpenseData = {
    expenseName: string;
    expenseCategory: string;
    amount: number;
    paymentMode: string;
    mode: 'DEBITED' | 'CREDITED';
    senderOrReceiver: string,
    transactionDate: string;
    notes: string,
    currency: string,
    customGrouping: string
};

type CreateExpenseBody = {
      expenseName: string;
      expenseCategory: string;
      amount: number;
      paymentMode: string;
      mode: 'DEBITED' | 'CREDITED';
      senderOrReceiver: string,
      transactionDate: string;
      notes: string,
      currency: 'INR',
      customGrouping: string
};

type UserState = {
  email: string,
  first_name: string,
  last_name: string
}

type StatisticsNote = {
  value: string,
  symbol: string,
  direction: 'increase' | 'decrease' | null,
  sign: 'positive' | 'negative' | null,
  description: string,
  graphData: number[]
}

type statisticFooter = {
  value: string,
  direction: 'increase' | 'decrease' | null,
  sign: 'positive' | 'negative' | null,
  description: string,
}

type StatisticDetail = {
  title: string,
  note: StatisticsNote[],
  body: {
    currency: 'INR',
    value: string,
    color: string,
    symbol: string | null
  }
  footer: statisticFooter[]

};

type AggregatedStat  = {
  totalAmount: number;
  transactionCount: number;
}

type AggregationResult = Record<string, AggregatedStat>;

type Months = 'jan' | 'feb' | 'mar' | 'apr' | 'may' | 'jun' | 'jul' | 'aug' | 'sep' | 'oct' | 'nov' | 'dec';

type ExpenseInsightsStatistics = {
  financialTotals: {
    totalOutflow: number;
    totalInflow: number;
    netCashFlow: number;
  };
  behavioral: {
    highestSinglePurchase: number;
    averageTransactionValue: number;
    totalTransactions: number;
  };
  distributions: {
    byCategory: Record<string, number>;
    byPaymentMode: Record<string, number>;
    byCustomGroup: Record<string, number>;
    topCategory: { category: string; amount: number } | null;
    preferredPaymentMode: { mode: string; count: number } | null;
  };
}
//  averageMonthlySpend: number;
//     peakMonth: { month: string; amount: number } | null;
//     dailyBurnRate: number;

type MonthlyExpenseInsights = Record<string, ExpenseInsightsStatistics>;

type FormContentType = 'overview-filter' | 'manual-entry' | 'transaction-filter' | 'view-transaction' | 'quick-entry';



// widget types

type widgetDetails = {
  widgetId: string;
  title: string;
  description: string;
  chartType: 'pie' | 'bar' | 'line';
  chartOptions: any[]
};

type widgetOptions = {
  option: echarts.EChartsOption | null
}