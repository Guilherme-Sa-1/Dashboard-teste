import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, CheckSquare, Activity } from "lucide-react";

export default async function DashboardHome() {
  const today = new Date().toLocaleString("en-CA", { timeZone: "America/Sao_Paulo" }).split(",")[0];

  // Busca todos os dados de forma paralela para carregar mais rápido
  const [accounts, pendingTasksCount, habits] = await Promise.all([
    prisma.account.findMany(),
    prisma.task.count({ where: { isCompleted: false } }),
    prisma.habit.findMany({
      include: { logs: { where: { date: today } } },
    }),
  ]);

  // Cálculos do resumo
  const totalBalance = accounts.reduce((acc, account) => acc + account.balance, 0);
  const totalHabits = habits.length;
  const completedHabits = habits.filter(habit => habit.logs.length > 0).length;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Card Financeiro */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        {/* Card Tarefas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Pendentes</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasksCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Para fazer</p>
          </CardContent>
        </Card>

        {/* Card Hábitos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hábitos de Hoje</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedHabits} / {totalHabits}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Hábitos concluídos</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}