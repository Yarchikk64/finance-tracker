'use client'

import { useState } from "react";
import { observer } from "mobx-react-lite";
import { financeStore } from "@/store/finance.store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { getIcon } from "@/helpers/icons";
import { groupTransactionsByDate } from "@/helpers/finance.helpers";

import { Transaction, GroupedData } from "@/types/interfaces";

export const TransactionHistory = observer(() => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = financeStore.filteredTransactions.filter((t: Transaction) => {
    const matchesSearch = t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const grouped: GroupedData = groupTransactionsByDate(filtered, financeStore.locale);

  return (
    <Card className="shadow-sm border-none bg-slate-50/50">
      <CardHeader>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {Object.keys(grouped).length > 0 ? (
            Object.entries(grouped).map(([date, data]) => (
              <div key={date} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-white border px-2 py-0.5 rounded">
                    {date}
                  </span>
                  <div className="h-[1px] flex-1 bg-slate-200"></div>
                  <span className={`text-[10px] font-bold ${data.dailyTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {financeStore.formatAmount(data.dailyTotal)}
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
                          {t.type === 'income' ? '' : '-'}{financeStore.formatAmount(t.amount)}
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