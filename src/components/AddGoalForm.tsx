'use client'
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function AddGoalForm({ onRefresh, currency }: { onRefresh: () => void, currency: string }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('savings_goals').insert([{
      name: formData.get("name"),
      target_amount: parseFloat(formData.get("target") as string),
      user_id: user?.id
    }]);
    if (!error) { toast.success("Goal set!"); onRefresh(); }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label>Goal Name</Label>
        <Input name="name" placeholder="New Laptop" required />
      </div>
      <div className="space-y-2">
        <Label>Target Amount ({currency})</Label>
        <Input name="target" type="number" placeholder="1000" required />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>Save Goal</Button>
    </form>
  );
}