import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, Trash2 } from "lucide-react";
import { CreateTaskModal } from "@/features/tasks/components/create-task-modal";
import { toggleTask, deleteTask } from "@/features/tasks/actions";

export default async function TasksPage() {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
    include: { project: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tarefas</h1>
        <CreateTaskModal />
      </div>

      <div className="grid gap-4">
        {tasks.length === 0 ? (
          <p className="text-muted-foreground">Você ainda não tem tarefas cadastradas.</p>
        ) : (
          tasks.map((task) => {
            const toggleAction = toggleTask.bind(null, task.id, task.isCompleted);
            const deleteAction = deleteTask.bind(null, task.id);

            return (
              <Card key={task.id} className="flex flex-row items-center p-4 justify-between group">
                <div className="flex items-center">
                  <form action={toggleAction}>
                    <button type="submit" className="mr-4 text-muted-foreground hover:text-primary">
                      {task.isCompleted ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : (
                        <Circle className="h-6 w-6" />
                      )}
                    </button>
                  </form>
                  <div>
                    <CardTitle className={`text-base font-medium ${task.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </CardTitle>
                    <CardContent className="p-0 mt-1 flex gap-2 text-sm text-muted-foreground">
                      <span>{task.project?.name || "Sem projeto"}</span>
                      {task.dueDate && (
                        <span>• Vence em: {task.dueDate.toLocaleDateString()}</span>
                      )}
                    </CardContent>
                  </div>
                </div>

                <form action={deleteAction}>
                  <button type="submit" className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </form>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}