"use client";

import { observer } from "mobx-react-lite";
import { financeStore } from "@/store/finance.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTransactionForm } from "@/hooks/useTransactionForm"; 
import { TypeSelect } from "./atoms/TypeSelect";
import { CategorySelect } from "./atoms/CategorySelect";
import { GoalSelect } from "./atoms/GoalSelect"; 
import { AddTransactionFormProps } from "@/types/interfaces";

export const AddTransactionForm = observer(({ onRefresh }: AddTransactionFormProps) => {
  const { loading, category, setCategory, type, setType, handleSubmit } = useTransactionForm(onRefresh);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="grid grid-cols-2 gap-4">
        <TypeSelect value={type} onChange={setType} />
        
        <div className="space-y-2">
          <Label>Amount ({financeStore.currency})</Label>
          <Input name="amount" type="number" step="0.01" placeholder="0.00" required />
        </div>
      </div>

      <CategorySelect value={category} onChange={setCategory} />

      {category === "Savings" && <GoalSelect />}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : "Save Transaction"}
      </Button>
    </form>
  );
});