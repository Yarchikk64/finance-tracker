'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddTransactionForm } from "@/components/AddTransactionForm";
import { TransactionService } from "@/services/transactions";
import { financeStore } from "@/store/finance.store";
import { Logo } from "@/components/atoms/Logo";

export const Navbar = () => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLogout = async () => {
    await TransactionService.signOut();
    router.push("/login");
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <Logo />
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-lg">+ Transaction</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Transaction</DialogTitle></DialogHeader>
            <AddTransactionForm 
              currency={financeStore.currency} 
              onRefresh={() => { financeStore.fetchAllData(); setIsDialogOpen(false); }} 
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};