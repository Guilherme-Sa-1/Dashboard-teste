"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!title) throw new Error("O título é obrigatório");


  let project = await prisma.project.findFirst();

  if (!project) {
    const area = await prisma.area.findFirst();
    if (!area) throw new Error("Nenhuma área encontrada no banco.");

    project = await prisma.project.create({
      data: {
        name: "Geral",
        areaId: area.id,
      },
    });
  }


  await prisma.task.create({
    data: {
      title,
      description,
      projectId: project.id,
    },
  });

  revalidatePath("/tasks");
}

export async function toggleTask(id: string, currentStatus: boolean) {
  await prisma.task.update({
    where: { id },
    data: { isCompleted: !currentStatus },
  });
  revalidatePath("/tasks");
}

export async function deleteTask(id: string) {
  await prisma.task.delete({
    where: { id },
  });
  revalidatePath("/tasks");
}