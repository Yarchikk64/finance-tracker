import { Transaction, Totals, GroupedTransactions } from "@/types/interfaces";

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

export const groupTransactionsByDate = (
  transactions: Transaction[], 
  locale: string = 'en-US'
): GroupedTransactions => {
  return transactions.reduce((acc: GroupedTransactions, t) => {
    const date = new Date(t.date).toLocaleDateString(locale, {
      day: 'numeric',
      month: 'short',
    });

    if (!acc[date]) {
      acc[date] = { items: [], dailyTotal: 0 };
    }
    
    acc[date].items.push(t);
    acc[date].dailyTotal += t.type === 'income' ? t.amount : -t.amount;
    
    return acc;
  }, {});
};