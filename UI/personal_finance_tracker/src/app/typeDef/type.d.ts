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
  userId: {
    $oid: string;
  };
  paymentMode: 'CASH','CREDIT CARD','DEBIT CARD','UPI','WALLET','BANK_TRANSFER','CHEQUE'; 
  mode: 'DEBITED' | 'CREDITED';
  expenseDate: {
    $date: string;
  };
  notes: string;
  currency: string;
  customGrouping: string;
  __v: number;
  createdAt: {
    $date: string;
  };
  updatedAt: {
    $date: string;
  };
};


type UserState = {
  email: string,
  first_name: string,
  last_name: string
}

type StatisticsNote = {
  value: string,
  symbol: string,
  direction: 'increase' | 'decrease',
  description: string
}

type statisticFooter = {
  value: string,
  direction: 'increase' | 'decrease',
  description: string
}

type StatisticDetail = {
  title: string,
  note: StatisticsNote[],
  body: {
    symbol: string,
    value: string,
    color: string
  }
  footer: statisticFooter[]

}