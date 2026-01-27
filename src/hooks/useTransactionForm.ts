import { useState } from "react";
import { financeStore } from "@/store/finance.store";
import { toast } from "sonner";

export const useTransactionForm = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [type, setType] = useState("expense");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const amount = parseFloat(formData.get("amount") as string);
    const goalId = formData.get("goal_id") ? Number(formData.get("goal_id")) : null;

    setLoading(true);
    try {
      const success = await financeStore.addTransaction({
        amount,
        category,
        type: type as "income" | "expense",
        goal_id: goalId,
        date: new Date().toISOString(),
      });

      if (success) {
        toast.success("Transaction added!");
        (e.target as HTMLFormElement).reset();
        setCategory("");
        onSuccess?.(); 
      }
    } catch (error) {
      toast.error("Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    category,
    setCategory,
    type,
    setType,
    handleSubmit
  };
};