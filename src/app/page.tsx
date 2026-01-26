'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import { financeStore } from "@/store/finance.store";
import { TransactionService } from "../services/transactions";

// Atoms & Molecules
import { CurrencySelect } from "@/components/atoms/CurrencySelect";
import { DateSelect } from "@/components/atoms/DateSelect";
import { StatCard } from "@/components/molecules/StatCard";

// Organisms
import { Navbar } from "@/components/organisms/Navbar";
import { SavingsGoals } from "@/components/organisms/SavingsGoals";
import { TransactionHistory } from "@/components/organisms/TransactionHistory";
import { ExpenseChart } from "@/components/organisms/ExpenseChart";

// Icons & Constants
import { Wallet, ArrowUpCircle, ArrowDownCircle, CalendarDays } from "lucide-react";
import { months } from "@/constants/finance";
import { getTotals } from "@/helpers/finance.helpers";

export default observer(function Home() {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const init = async () => {
      const session = await TransactionService.getSession();
      if (!session) return router.push("/login");
      await financeStore.fetchAllData();
    };
    init();
  }, [router]);

  // Вычисления
  const currentMonthTransactions = financeStore.transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  const { income, expenses, balance } = getTotals(currentMonthTransactions);

  const chartData = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any[], curr) => {
      const existing = acc.find(item => item.name === curr.category);
      if (existing) existing.value += curr.amount;
      else acc.push({ name: curr.category, value: curr.amount });
      return acc;
    }, []);

  return (
    <main className="max-w-6xl mx-auto p-6 md:p-10">
      <Navbar />

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-slate-50 rounded-xl border">
        <CurrencySelect 
          value={financeStore.currency} 
          onChange={(val) => financeStore.setCurrency(val)} 
        />
        <CalendarDays size={18} className="text-muted-foreground" />
        <DateSelect 
          value={selectedMonth} 
          options={months.map((m, i) => ({ label: m, value: i }))} 
          onChange={setSelectedMonth} 
        />
        <DateSelect 
          value={selectedYear} 
          options={[2024, 2025, 2026].map(y => ({ label: y, value: y }))} 
          onChange={setSelectedYear} 
        />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Balance" amount={balance} icon={<Wallet className="text-blue-500" />} color={balance < 0 ? "text-red-600" : "text-blue-600"} currency={financeStore.currency} />
        <StatCard title="Income" amount={income} icon={<ArrowUpCircle className="text-green-500" />} color="text-green-600" prefix="+" currency={financeStore.currency} />
        <StatCard title="Expenses" amount={expenses} icon={<ArrowDownCircle className="text-red-500" />} color="text-red-600" prefix="-" currency={financeStore.currency} />
      </div>

      <SavingsGoals />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <ExpenseChart data={chartData} />
        <TransactionHistory selectedMonth={selectedMonth} selectedYear={selectedYear} />
      </div>
    </main>
  );
});