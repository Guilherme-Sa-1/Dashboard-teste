"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTransaction(formData: FormData) {
  const description = formData.get("description") as string;
  const amountStr = formData.get("amount") as string;
  const type = formData.get("type") as string; // INCOME ou EXPENSE

  if (!description || !amountStr || !type) {
    throw new Error("Preencha todos os campos obrigatórios");
  }

  const amount = parseFloat(amountStr);

  // Pega o usuário padrão do sistema (que criamos no seed)
  const user = await prisma.user.findFirst();
  if (!user) throw new Error("Usuário não encontrado.");

  // 1. Garante que o usuário tem uma conta
  let account = await prisma.account.findFirst({ where: { userId: user.id } });
  if (!account) {
    account = await prisma.account.create({
      data: { name: "Carteira Principal", balance: 0, userId: user.id },
    });
  }

  // 2. Garante que existe uma categoria para este tipo de transação
  let category = await prisma.category.findFirst({
    where: { userId: user.id, type },
  });
  if (!category) {
    category = await prisma.category.create({
      data: {
        name: type === "INCOME" ? "Receitas Gerais" : "Despesas Gerais",
        type,
        userId: user.id,
      },
    });
  }

  // 3. Cria a transação no banco
  await prisma.transaction.create({
    data: {
      description,
      amount,
      type,
      accountId: account.id,
      categoryId: category.id,
    },
  });

  // 4. Atualiza o saldo da conta
  const newBalance = type === "INCOME" ? account.balance + amount : account.balance - amount;
  await prisma.account.update({
    where: { id: account.id },
    data: { balance: newBalance },
  });

  // 5. Atualiza a tela
  revalidatePath("/finance");
}

export async function deleteTransaction(id: string) {
  // 1. Busca a transação para saber o valor, tipo e qual conta afetar
  const transaction = await prisma.transaction.findUnique({
    where: { id },
  });

  if (!transaction) throw new Error("Transação não encontrada");

  // 2. Busca a conta vinculada
  const account = await prisma.account.findUnique({
    where: { id: transaction.accountId },
  });

  if (!account) throw new Error("Conta não encontrada");

  // 3. Faz o cálculo inverso no saldo
  const newBalance =
    transaction.type === "INCOME"
      ? account.balance - transaction.amount // Se era entrada, tira o dinheiro
      : account.balance + transaction.amount; // Se era saída, devolve o dinheiro

  // 4. Atualiza a conta e deleta a transação em uma única operação (Transaction)
  await prisma.$transaction([
    prisma.account.update({
      where: { id: account.id },
      data: { balance: newBalance },
    }),
    prisma.transaction.delete({
      where: { id },
    }),
  ]);

  // 5. Atualiza a página
  revalidatePath("/finance");
}