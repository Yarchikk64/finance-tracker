"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const CATEGORIES = [
  { name: "Food", icon: "🍔" }, { name: "Grocery", icon: "🛒" }, { name: "Salary", icon: "💰" },
  { name: "Work", icon: "💼" }, { name: "Transport", icon: "🚗" }, { name: "Taxi", icon: "🚕" },
  { name: "Rent", icon: "🏠" }, { name: "Utilities", icon: "⚡" }, { name: "Health", icon: "💊" },
  { name: "Gym", icon: "💪" }, { name: "Shopping", icon: "🛍️" }, { name: "Entertainment", icon: "🎮" },
  { name: "Travel", icon: "✈️" }, { name: "Gift", icon: "🎁" }, { name: "Subscription", icon: "📺" },
  { name: "Coffee", icon: "☕" }, { name: "Savings", icon: "🏦" },
];

export function AddTransactionForm({ onRefresh, currency }: { onRefresh: () => void, currency: string }) {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [type, setType] = useState("expense");
  const [goals, setGoals] = useState<any[]>([]);

  useEffect(() => {
    async function fetchGoals() {
      const { data } = await supabase.from('savings_goals').select('*');
      setGoals(data || []);
    }
    fetchGoals();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("transactions").insert([{
      amount: parseFloat(formData.get("amount") as string),
      category, type, goal_id: formData.get("goal_id") || null,
      date: new Date().toISOString(), user_id: user?.id
    }]);
    if (!error) { toast.success("Added!"); onRefresh(); }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Type</Label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full h-10 border rounded-md px-3 text-sm">
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Amount ({currency})</Label>
          <Input name="amount" type="number" step="0.01" required />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Category</Label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-10 border rounded-md px-3 text-sm" required>
          <option value="" disabled>Select...</option>
          {CATEGORIES.map(cat => <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>)}
        </select>
      </div>
      {category === "Savings" && (
        <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 space-y-2">
          <Label>Select Goal</Label>
          <select name="goal_id" className="w-full h-10 border rounded-md px-3 text-sm" required>
            <option value="" disabled>Which goal?</option>
            {goals.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
      )}
      <Button type="submit" className="w-full" disabled={loading}>{loading ? "Saving..." : "Save Transaction"}</Button>
    </form>
  );
}