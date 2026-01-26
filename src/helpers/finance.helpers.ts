import { Transaction, Totals } from "@/types/interfaces";

export const getTotals = (transactions: Transaction[]): Totals => {
  return transactions.reduce(
    (acc, t) => {
      if (t.type === 'income') acc.income += t.amount;
      else acc.expenses += t.amount;
      acc.balance = acc.income - acc.expenses;
      return acc;
    },
    { income: 0, expenses: 0, balance: 0 }
  );
};

interface GroupedTransactions {
  [date: string]: {
    items: Transaction[];
    dailyTotal: number;
  };
}

export const groupTransactionsByDate = (transactions: Transaction[]): GroupedTransactions => {
  return transactions.reduce((acc: GroupedTransactions, t) => {
    const date = new Date(t.date).toLocaleDateString('en-GB');
    if (!acc[date]) {
      acc[date] = { items: [], dailyTotal: 0 };
    }
    acc[date].items.push(t);
    acc[date].dailyTotal += t.type === 'income' ? t.amount : -t.amount;
    return acc;
  }, {});
};