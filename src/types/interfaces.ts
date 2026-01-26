
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: number;
  created_at: string;
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

export interface Transaction {
  id: number;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: string;
  goal_id?: number | null;
}

// Выносим сюда
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