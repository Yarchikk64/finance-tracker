'use client'

import { useState } from "react";
import { observer } from "mobx-react-lite";
import { financeStore } from "@/store/finance.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Trash2 } from "lucide-react";
import { getIcon } from "@/helpers/icons";
import { groupTransactionsByDate } from "@/helpers/finance.helpers";

import { Transaction, GroupedData, TransactionHistoryProps } from "@/types/interfaces";

export const TransactionHistory = observer(({ selectedMonth, selectedYear }: TransactionHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = financeStore.transactions.filter((t: Transaction) => {
    const d = new Date(t.date);
    const matchesDate = d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    const matchesSearch = t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || t.type === typeFilter;
    
    return matchesDate && matchesSearch && matchesType;
  });

  const grouped: GroupedData = groupTransactionsByDate(filtered);

  return (
    <Card className="shadow-sm border-none bg-slate-50/50">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>History</CardTitle>
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
          <Input 
            placeholder="Search categories..." 
            className="pl-8 bg-white" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {Object.keys(grouped).length > 0 ? (
            (Object.entries(grouped) as [string, GroupedData[string]][]).map(([date, data]) => (
              <div key={date} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-white border px-2 py-0.5 rounded shadow-sm">
                    {date}
                  </span>
                  <div className="h-[1px] flex-1 bg-slate-200"></div>
                  <span className={`text-[10px] font-bold ${data.dailyTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {data.dailyTotal > 0 ? '+' : ''}{data.dailyTotal.toFixed(2)}{financeStore.currency}
                  </span>
                </div>
                <div className="space-y-2">
                  {data.items.map((t: Transaction) => (
                    <div key={t.id} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm group border border-transparent hover:border-primary/20 transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 flex items-center justify-center rounded-full text-lg ${t.type === 'income' ? 'bg-green-50' : 'bg-slate-50'}`}>
                          {t.type === 'income' ? "📈" : getIcon(t.category)}
                        </div>
                        <span className="font-medium text-sm capitalize">{t.category}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-bold text-sm ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {t.type === 'income' ? '+' : '-'}{t.amount.toFixed(2)}{financeStore.currency}
                        </span>
                        <button 
                          onClick={() => financeStore.deleteTransaction(t.id)} 
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-600 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-muted-foreground italic text-sm">
              No transactions for this period
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});