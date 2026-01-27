
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: number;
  created_at?: string;
  amount: number;
  category: string;
  type: TransactionType;
  date: string;
  goal_id?: number | null;
  user_id: string;
}

export interface Goal {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  user_id: string;
}

export interface Totals {
  income: number;
  expenses: number;
  balance: number;
}

export interface GroupedData {
  [date: string]: {
    items: Transaction[];
    dailyTotal: number;
  };
}

export interface TransactionHistoryProps {
  selectedMonth: number;
  selectedYear: number;
}

export interface ChartData {
    name: string;
    value: number;
}

export interface StatCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  color?: string;
  prefix?: string;
  currency?: string;
}

export interface Props {
  category: string;
  type: 'income' | 'expense';
}

export interface CurrencySelectProps {
  value: string;
  onChange: (val: string) => void;
}

export interface DateSelectProps {
  value: number;
  options: { label: string | number; value: number }[];
  onChange: (val: number) => void;
}

export interface GroupedTransactions {
  [date: string]: {
    items: Transaction[];
    dailyTotal: number;
  };
}

export interface AddTransactionFormProps {
  onSuccess?: () => void;
}

export interface Category {
  name: string;
  icon: string;
}