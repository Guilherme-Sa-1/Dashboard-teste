"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createHabit } from "@/features/habits/actions";

interface Props {
  areas: { id: string; name: string }[];
}

export function CreateHabitModal({ areas }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="mr-2 h-4 w-4" /> Novo Hábito</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Adicionar Hábito</DialogTitle></DialogHeader>
        <form action={async (fd) => { await createHabit(fd); setOpen(false); }} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Nome</Label>
            <Input name="name" required />
          </div>
          
          <div className="grid gap-2">
            <Label>Área</Label>
            <select name="areaId" className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" required>
              <option value="">Selecione uma área</option>
              {areas.map(area => (
                <option key={area.id} value={area.id}>{area.name}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label>Frequência</Label>
            <select name="frequency" className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" required>
              <option value="DAILY">Diário</option>
              <option value="WEEKLY">Semanal</option>
            </select>
          </div>
          <Button type="submit">Salvar</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}