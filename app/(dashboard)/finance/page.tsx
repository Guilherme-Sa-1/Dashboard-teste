import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle, Wallet, Trash2 } from "lucide-react";
import { CreateTransactionModal } from "@/features/finance/components/create-transaction-modal";
import { deleteTransaction } from "@/features/finance/actions";

export default async function FinancePage() {
  // Busca o saldo das contas e as últimas transações
  const accounts = await prisma.account.findMany();
  const transactions = await prisma.transaction.findMany({
    orderBy: { date: "desc" },
    include: { category: true },
  });

  // Calcula o saldo total somando todas as contas do usuário
  const totalBalance = accounts.reduce((acc, account) => acc + account.balance, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
        <CreateTransactionModal />
      </div>

      {/* Grid de Resumo Financeiro */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Soma de todas as suas contas cadastradas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Transações */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Últimas Transações</h2>
        <div className="grid gap-4">
          {transactions.length === 0 ? (
            <p className="text-muted-foreground italic">Nenhuma transação registrada ainda.</p>
          ) : (
            transactions.map((transaction) => {
              // Prepara a server action para este ID específico
              const deleteAction = deleteTransaction.bind(null, transaction.id);

              return (
                <Card key={transaction.id} className="flex flex-row items-center justify-between p-4 group hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-4">
                    {transaction.type === "INCOME" ? (
                      <ArrowUpCircle className="h-8 w-8 text-green-500 shrink-0" />
                    ) : (
                      <ArrowDownCircle className="h-8 w-8 text-red-500 shrink-0" />
                    )}
                    <div>
                      <p className="font-medium leading-none">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {transaction.category.name} • {transaction.date.toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className={`font-bold text-right ${transaction.type === "INCOME" ? "text-green-500" : "text-red-500"}`}>
                      {transaction.type === "INCOME" ? "+" : "-"} R$ {transaction.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </div>
                    
                    {/* Formulário para Excluir Transação */}
                    <form action={deleteAction}>
                      <button 
                        type="submit" 
                        className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-2"
                        title="Excluir transação"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </form>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}