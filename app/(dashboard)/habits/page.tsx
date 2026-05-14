import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Activity, Trash2, CheckCircle2, Circle } from "lucide-react";
import { CreateHabitModal } from "@/features/habits/components/create-habit-modal";
import { deleteHabit, toggleHabitLog } from "@/features/habits/actions";

export default async function HabitsPage() {
  const today = new Date().toLocaleString("en-CA", { timeZone: "America/Sao_Paulo" }).split(",")[0];

  const [habits, areas] = await Promise.all([
    prisma.habit.findMany({
      orderBy: { createdAt: "desc" },
      include: { area: true, logs: { where: { date: today } } },
    }),
    prisma.area.findMany()
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Hábitos</h1>
        {/* Passamos as áreas para o modal aqui */}
        <CreateHabitModal areas={areas} />
      </div>

      <div className="grid gap-4">
        {habits.map((habit) => {
          const isCompletedToday = habit.logs.length > 0;
          const toggleAction = toggleHabitLog.bind(null, habit.id, today);

          return (
            <Card key={habit.id} className="flex items-center justify-between p-4 group">
              <div className="flex items-center gap-4">
                <form action={toggleAction}>
                  <button type="submit" className="flex items-center justify-center">
                    {isCompletedToday ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground hover:text-primary" />
                    )}
                  </button>
                </form>
                <div>
                  <CardTitle className={`text-base font-medium ${isCompletedToday ? 'line-through text-muted-foreground' : ''}`}>
                    {habit.name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {habit.area.name} • {habit.frequency}
                  </p>
                </div>
              </div>

              <form action={deleteHabit.bind(null, habit.id)}>
                <button type="submit" className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 p-2">
                  <Trash2 className="h-5 w-5" />
                </button>
              </form>
            </Card>
          );
        })}
      </div>
    </div>
  );
}