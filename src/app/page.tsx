'use client'

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddTransactionForm } from "@/components/AddTransactionForm";
import { AddGoalForm } from "@/components/AddGoalForm";
import { Trash2, ArrowUpCircle, ArrowDownCircle, Wallet, PieChart as PieChartIcon, Search, LogOut, CalendarDays, Target, Plus, Coins, Filter } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { toast } from "sonner";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const CURRENCIES = [
  { label: "EUR (€)", symbol: "€" },
  { label: "PLN (zł)", symbol: "zł" }
];

const CATEGORY_ICONS: Record<string, string> = {
  food: "🍔", eat: "🍕", grocery: "🛒", salary: "💰", work: "💼", 
  transport: "🚗", taxi: "🚕", rent: "🏠", utilities: "⚡", 
  health: "💊", gym: "💪", shopping: "🛍️", entertainment: "🎮", 
  travel: "✈️", gift: "🎁", subscription: "📺", coffee: "☕", savings: "🏦"
};

const getIcon = (category: string) => {
  const lowerCat = category?.toLowerCase() || "";
  const key = Object.keys(CATEGORY_ICONS).find(k => lowerCat.includes(k));
  return key ? CATEGORY_ICONS[key] : "💸";
};

function StatCard({ title, amount, icon, color = "", prefix = "", currency = "€" }: any) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <Card className="border-none shadow-sm bg-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold tracking-tight ${color}`}>
          {mounted ? `${prefix}${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}${currency}` : `${prefix}0.00${currency}`}
        </div>
      </CardContent>
    </Card>
  )
}

export default function Home() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [goals, setGoals] = useState<any[]>([]);
  const [currency, setCurrency] = useState("€");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("preferred_currency");
    if (saved) setCurrency(saved);
  }, []);

  const handleCurrencyChange = (val: string) => {
    setCurrency(val);
    localStorage.setItem("preferred_currency", val);
  };

  const fetchData = async () => {
    const { data: trans } = await supabase.from('transactions').select('*').order('date', { ascending: false });
    const { data: g } = await supabase.from('savings_goals').select('*');
    setTransactions(trans || []);
    setGoals(g || []);
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push("/login");
      else fetchData();
    };
    checkUser();
  }, [router]);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this transaction?")) return;
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) { toast.success("Deleted"); fetchData(); }
  };

  const currentMonthTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  const income = currentMonthTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expenses = currentMonthTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = income - expenses;

  const filteredTransactions = currentMonthTransactions.filter(t => {
    const matchesSearch = t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const groupedTransactions = filteredTransactions.reduce((groups: any, t) => {
    const date = new Date(t.date).toLocaleDateString('en-GB');
    if (!groups[date]) groups[date] = { items: [], dailyTotal: 0 };
    groups[date].items.push(t);
    groups[date].dailyTotal += t.type === 'expense' ? -t.amount : t.amount;
    return groups;
  }, {});

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight italic text-primary">Finance Tracker</h1>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => { supabase.auth.signOut(); router.push("/login"); }} className="text-muted-foreground"><LogOut className="h-4 w-4 mr-2" /> Logout</Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild><Button className="shadow-lg">+ Transaction</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>New Transaction</DialogTitle></DialogHeader>
                <AddTransactionForm currency={currency} onRefresh={() => { fetchData(); setIsDialogOpen(false); }} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-slate-50 rounded-xl border">
        <div className="flex items-center gap-2 border-r pr-4 mr-2">
          <Coins size={18} className="text-primary" />
          <select value={currency} onChange={(e) => handleCurrencyChange(e.target.value)} className="bg-transparent font-bold text-sm focus:outline-none cursor-pointer">
            {CURRENCIES.map(c => <option key={c.symbol} value={c.symbol}>{c.label}</option>)}
          </select>
        </div>
        <CalendarDays size={18} className="text-muted-foreground" />
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} className="p-2 bg-white border rounded-md text-sm">
          {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
        </select>
        <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="p-2 bg-white border rounded-md text-sm">
          {[2024, 2025, 2026].map(year => <option key={year} value={year}>{year}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Monthly Balance" amount={balance} icon={<Wallet className="text-blue-500" />} color={balance < 0 ? "text-red-600" : "text-blue-600"} currency={currency} />
        <StatCard title="Income" amount={income} icon={<ArrowUpCircle className="text-green-500" />} color="text-green-600" prefix="+" currency={currency} />
        <StatCard title="Expenses" amount={expenses} icon={<ArrowDownCircle className="text-red-500" />} color="text-red-600" prefix="-" currency={currency} />
      </div>

      <Card className="mb-10 shadow-sm border-none bg-primary/5 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2"><Target className="text-primary" size={20} /><CardTitle>Savings Goals</CardTitle></div>
          <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
            <DialogTrigger asChild><Button size="sm" variant="outline" className="h-8 gap-1"><Plus size={14}/> Add Goal</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Set New Goal</DialogTitle></DialogHeader>
              <AddGoalForm currency={currency} onRefresh={() => { fetchData(); setIsGoalDialogOpen(false); }} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.length > 0 ? goals.map(goal => {
              const amount = transactions.filter(t => t.goal_id === goal.id && t.category === 'Savings').reduce((acc, t) => acc + t.amount, 0);
              const progress = Math.min((amount / goal.target_amount) * 100, 100);
              return (
                <div key={goal.id} className="bg-white p-4 rounded-lg shadow-sm border border-primary/10">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-sm">{goal.name}</span>
                    <span className="text-xs text-muted-foreground">{amount.toFixed(0)}{currency} / {goal.target_amount}{currency}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3"><div className="bg-primary h-3 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} /></div>
                </div>
              )
            }) : <p className="text-center py-4 text-xs text-muted-foreground italic col-span-2">No goals set.</p>}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card className="shadow-sm border-none bg-slate-50/50">
          <CardHeader className="flex flex-row items-center gap-2"><PieChartIcon size={20} className="text-primary" /><CardTitle>Expense Distribution</CardTitle></CardHeader>
          <CardContent className="h-[300px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value">
                    {chartData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v.toFixed(2)}${currency}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="h-full flex items-center justify-center text-muted-foreground italic text-sm">No expenses this month</div>}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-slate-50/50">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle>Recent History</CardTitle>
              <div className="flex bg-white border rounded-lg p-1 gap-1">
                {['all', 'income', 'expense'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setTypeFilter(f)}
                    className={`px-2 py-1 text-[10px] font-bold rounded capitalize transition-all ${
                      typeFilter === f ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:bg-slate-50'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search categories..." className="pl-8 bg-white" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {Object.keys(groupedTransactions).length > 0 ? Object.entries(groupedTransactions).map(([date, data]: any) => (
                <div key={date} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-white border px-2 py-0.5 rounded shadow-sm">
                      {date === new Date().toLocaleDateString('en-GB') ? "Today" : date}
                    </span>
                    <div className="h-[1px] flex-1 bg-slate-200"></div>
                    <span className={`text-[10px] font-bold ${data.dailyTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {data.dailyTotal > 0 ? '+' : ''}{data.dailyTotal.toFixed(2)}{currency}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {data.items.map((t: any) => (
                      <div key={t.id} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm group border border-transparent hover:border-primary/20 transition-all">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 flex items-center justify-center rounded-full text-lg ${t.type === 'income' ? 'bg-green-50' : 'bg-slate-50'}`}>{t.type === 'income' ? "📈" : getIcon(t.category)}</div>
                          <span className="font-medium text-sm capitalize">{t.category}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`font-bold text-sm ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{t.type === 'income' ? '+' : '-'}{t.amount.toFixed(2)}{currency}</span>
                          <button onClick={() => handleDelete(t.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-600"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )) : <p className="text-center py-10 text-muted-foreground italic text-sm">No transactions found</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}