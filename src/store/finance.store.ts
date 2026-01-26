// src/store/finance.store.ts
import { makeAutoObservable, runInAction } from "mobx";
import { TransactionService } from "../services/transactions";
import { Transaction, Goal } from "@/types/interfaces";

class FinanceStore {
  transactions: Transaction[] = [];
  goals: Goal[] = [];
  isLoading = false;
  currency = "€";

  constructor() {
    makeAutoObservable(this);
  }

  async fetchAllData() {
    this.isLoading = true;
    try {
      const [trans, g] = await Promise.all([
        TransactionService.fetchAll(),
        TransactionService.fetchGoals()
      ]);
      
      runInAction(() => {
        this.transactions = trans;
        this.goals = g;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => { this.isLoading = false; });
      console.error("Failed to fetch", error);
    }
  }

  setCurrency(symbol: string) {
    this.currency = symbol;
    localStorage.setItem("preferred_currency", symbol);
  }

  async deleteTransaction(id: number) {
    const { error } = await TransactionService.delete(id);
    if (!error) {
      runInAction(() => {
        this.transactions = this.transactions.filter(t => t.id !== id);
      });
      return true;
    }
    return false;
  }
}

export const financeStore = new FinanceStore();