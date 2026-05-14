"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createHabit(formData: FormData) {
  const name = formData.get("name") as string;
  const frequency = formData.get("frequency") as string;
  const areaId = formData.get("areaId") as string; // Agora pega a área do formulário

  if (!name || !frequency || !areaId) {
    throw new Error("Preencha todos os campos obrigatórios");
  }

  await prisma.habit.create({
    data: {
      name,
      frequency,
      areaId,
    },
  });

  revalidatePath("/habits");
}

export async function deleteHabit(id: string) {
  await prisma.habit.delete({
    where: { id },
  });
  revalidatePath("/habits");
}

export async function toggleHabitLog(habitId: string, date: string) {
  // Verifica se o hábito já foi marcado neste dia
  const existingLog = await prisma.habitLog.findUnique({
    where: {
      habitId_date: { habitId, date },
    },
  });

  if (existingLog) {
    // Se já foi marcado, remove (desmarca o check)
    await prisma.habitLog.delete({ where: { id: existingLog.id } });
  } else {
    // Se não foi marcado, cria o registro do dia
    await prisma.habitLog.create({
      data: { habitId, date },
    });
  }

  revalidatePath("/habits");
}