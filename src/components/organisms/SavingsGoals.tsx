'use client'

import { useState } from "react";
import { observer } from "mobx-react-lite";
import { financeStore } from "@/store/finance.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Target, Plus } from "lucide-react";
import { AddGoalForm } from "@/components/AddGoalForm";

export const SavingsGoals = observer(() => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Card className="mb-10 shadow-sm border-none bg-primary/5 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="text-primary" size={20} />
          <CardTitle>Savings Goals</CardTitle>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <Plus size={14}/> Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Set New Goal</DialogTitle></DialogHeader>
            <AddGoalForm 
              currency={financeStore.currency} 
              onRefresh={() => { financeStore.fetchAllData(); setIsDialogOpen(false); }} 
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {financeStore.goals.length > 0 ? financeStore.goals.map(goal => {
            const amount = financeStore.transactions
              .filter(t => t.goal_id === goal.id && t.category === 'Savings')
              .reduce((acc, t) => acc + t.amount, 0);
            const progress = Math.min((amount / goal.target_amount) * 100, 100);
            
            return (
              <div key={goal.id} className="bg-white p-4 rounded-lg shadow-sm border border-primary/10">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-sm">{goal.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {amount.toFixed(0)}{financeStore.currency} / {goal.target_amount}{financeStore.currency}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-1000" 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
              </div>
            )
          }) : (
            <p className="text-center py-4 text-xs text-muted-foreground italic col-span-2">
              No goals set.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
});