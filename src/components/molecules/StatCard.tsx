'use client'
import { observer } from "mobx-react-lite";
import { financeStore } from "@/store/finance.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCardProps } from "@/types/interfaces";

export const StatCard = observer(({ title, amount, icon, color = "" }: StatCardProps) => {
  
  return (
    <Card className="border-none shadow-sm bg-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div 
          className={`text-3xl font-bold tracking-tight ${color}`}
          suppressHydrationWarning
        >
          {financeStore.formatAmount(amount)}
        </div>
      </CardContent>
    </Card>
  );
});