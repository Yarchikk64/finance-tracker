"use client";

import { observer } from "mobx-react-lite";
import { financeStore } from "@/store/finance.store";
import { Label } from "@/components/ui/label";

export const GoalSelect = observer(() => {
  if (financeStore.goals.length === 0) return null;

  return (
    <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 animate-in fade-in slide-in-from-top-2">
      <Label className="text-[10px] uppercase font-bold text-primary">
        Link to Savings Goal
      </Label>
      <select 
        name="goal_id" 
        className="w-full h-10 border-none bg-transparent px-0 text-sm focus:ring-0 cursor-pointer" 
        required
      >
        <option value="" disabled selected>Which goal is this for?</option>
        {financeStore.goals.map((goal) => (
          <option key={goal.id} value={goal.id}>
            {goal.name} (Target: {financeStore.currency}{goal.target_amount})
          </option>
        ))}
      </select>
    </div>
  );
});