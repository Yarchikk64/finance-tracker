// src/services/transaction.service.ts
import { supabase } from "@/lib/supabase";

export const TransactionService = {
  // Твои текущие методы
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
  }
};