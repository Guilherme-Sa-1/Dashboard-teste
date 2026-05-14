"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createTransaction } from "@/features/finance/actions";

export function CreateTransactionModal() {
  const [open, setOpen] = useState(false);

  async function actionWrapper(formData: FormData) {
    await createTransaction(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nova Transação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Transação</DialogTitle>
        </DialogHeader>
        
        <form action={actionWrapper} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Input id="description" name="description" placeholder="Ex: Salário, Aluguel..." required />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input id="amount" name="amount" type="number" step="0.01" min="0" placeholder="0.00" required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="type">Tipo</Label>
            <select 
              id="type" 
              name="type" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            >
              <option value="INCOME">Receita (Entrada)</option>
              <option value="EXPENSE">Despesa (Saída)</option>
            </select>
          </div>

          <Button type="submit" className="mt-2">Salvar Transação</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}