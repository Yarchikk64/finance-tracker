'use client'
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCardProps } from "@/types/interfaces";


export function StatCard({ title, amount, icon, color = "", prefix = "", currency = "€" }: StatCardProps) {
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
          {mounted 
            ? `${prefix}${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}${currency}` 
            : `${prefix}0.00${currency}`}
        </div>
      </CardContent>
    </Card>
  );
}