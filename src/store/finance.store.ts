import { makeAutoObservable, runInAction } from "mobx";
import { TransactionService } from "../services/transactions";
import { Transaction, Goal, ChartData } from "@/types/interfaces";

class FinanceStore {
  transactions: Transaction[] = [];
  goals: Goal[] = [];
  isLoading = false;
  currency = "€";
  locale = "en-US";
  
  selectedMonth = new Date().getMonth();
  selectedYear = new Date().getFullYear();

  constructor() {
    makeAutoObservable(this);
  }

  initSettings() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("preferred_currency");
      if (saved) runInAction(() => { this.currency = saved; });
      runInAction(() => {
        this.locale = navigator.language || "en-US";
      });
    }
  }

  setSelectedMonth(month: number) { this.selectedMonth = month; }
  setSelectedYear(year: number) { this.selectedYear = year; }

  formatAmount(amount: number) {
    const currencyMap: Record<string, string> = {
      "€": "EUR", "$": "USD", "zł": "PLN", "₽": "RUB"
    };
    const currencyCode = currencyMap[this.currency] || "USD";
    return new Intl.NumberFormat(this.locale, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
    }).format(amount);
  }

  get filteredTransactions() {
    return this.transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === this.selectedMonth && d.getFullYear() === this.selectedYear;
    });
  }

  get currentChartData(): ChartData[] {
    return this.filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc: ChartData[], curr) => {
        const existing = acc.find(item => item.name === curr.category);
        if (existing) existing.value += curr.amount;
        else acc.push({ name: curr.category, value: curr.amount });
        return acc;
      }, []);
  }

  get goalsWithProgress() {
    return this.goals.map(goal => {
      const saved = this.transactions
        .filter(t => t.goal_id === goal.id && t.category === 'Savings')
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        ...goal,
        current_amount: saved,
        progress: goal.target_amount > 0 ? Math.min((saved / goal.target_amount) * 100, 100) : 0
      };
    });
  }

  async fetchAllData() {
    this.isLoading = true;
    try {
      const [trans, g] = await Promise.all([
        TransactionService.fetchAll(),
        TransactionService.fetchGoals()
      ]);
      runInAction(() => {
        this.transactions = (trans as Transaction[]).sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.goals = g as Goal[];
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => { this.isLoading = false; });
    }
  }

  setCurrency(symbol: string) {
    this.currency = symbol;
    if (typeof window !== "undefined") localStorage.setItem("preferred_currency", symbol);
  }

  async deleteTransaction(id: number) {
    const { error } = await TransactionService.delete(id);
    if (!error) {
      runInAction(() => { this.transactions = this.transactions.filter(t => t.id !== id); });
      return true;
    }
    return false;
  }

  async addTransaction(transactionData: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) {
    const { data: resultData, error } = await TransactionService.create(transactionData);
    if (!error && resultData) {
      runInAction(() => {
        this.transactions.unshift(resultData as Transaction);
        this.transactions = [...this.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      });
      return true;
    }
    return false;
  }
}

export const financeStore = new FinanceStore();