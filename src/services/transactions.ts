import { supabase } from "@/lib/supabase";
import { Transaction } from "@/types/interfaces";

export const TransactionService = {
  async fetchAll() {
    const { data } = await supabase.from('transactions').select('*').order('date', { ascending: false });
    return data || [];
  },
  
  async delete(id: number) {
    return await supabase.from('transactions').delete().eq('id', id);
  },
  
  async fetchGoals() {
    const { data } = await supabase.from('savings_goals').select('*');
    return data || [];
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  async signOut() {
    await supabase.auth.signOut();
  },

  async create(data: Omit<Transaction, 'id' | 'user_id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No user found");

    return await supabase
      .from("transactions")
      .insert([{ ...data, user_id: user.id }])
      .select()
      .single();
  }
};