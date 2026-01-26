'use client'

import { observer } from "mobx-react-lite";
import { financeStore } from "@/store/finance.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart as PieChartIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { COLORS } from "@/constants/finance";

interface ExpenseChartProps {
  data: any[];
}

export const ExpenseChart = observer(({ data }: ExpenseChartProps) => {
  return (
    <Card className="shadow-sm border-none bg-slate-50/50">
      <CardHeader className="flex flex-row items-center gap-2">
        <PieChartIcon size={20} className="text-primary" />
        <CardTitle>Expense Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={data} 
                cx="50%" 
                cy="50%" 
                innerRadius={70} 
                outerRadius={90} 
                paddingAngle={5} 
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => `${v.toFixed(2)}${financeStore.currency}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground italic text-sm">
            No expenses this month
          </div>
        )}
      </CardContent>
    </Card>
  );
});