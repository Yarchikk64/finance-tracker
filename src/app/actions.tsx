"use server";

import { db } from "@/db";
import { transactions } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function addTransaction(data: { amount: number; category: string }) {
  try {
    await db.insert(transactions).values({
      amount: data.amount,
      category: data.category,
    });
    
    revalidatePath("/"); 
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}