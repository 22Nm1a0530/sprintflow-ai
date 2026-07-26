import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { Plus, X } from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import NewTaskDialog from "../../components/kanban/NewTaskDialog";
import { fetchTasks, updateTaskStatus, deleteTask, type Task } from "../../services/taskService";
import { fetchProjects, type Project } from "../../services/projectService";

const columns: { id: Task["status"]; label: string }[] = [
  { id: "todo", label: "To Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "review", label: "Review" },
  { id: "done", label: "Done" },
];

const priorityColors: Record<Task["priority"], string> = {
  high: "bg-red-500/10 text-red-400",
  medium: "bg-amber-500/10 text-amber-400",
  low: "bg-slate-500/10 text-slate-400",
};

function Kanban() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStatus, setDialogStatus] = useState<Task["status"]>("todo");

  useEffect(() => {
    Promise.all([fetchTasks(), fetchProjects()]).then(([taskData, projectData]) => {
      setTasks(taskData);
      setProjects(projectData);
      setLoading(false);
    });
  }, []);

  function getProjectName(projectId: string): string {
    return projects.find((p) => p.id === projectId)?.name ?? "Unknown Project";
  }

  function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    const newStatus = result.destination.droppableId as Task["status"];
    const taskId = result.draggableId;

    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
    updateTaskStatus(taskId, newStatus);
  }

  function openAddDialog(status: Task["status"]) {
    setDialogStatus(status);
    setDialogOpen(true);
  }

  function handleTaskCreated(newTask: Task) {
    setTasks((prev) => [...prev, newTask]);
  }

  async function handleDeleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await deleteTask(id);
  }

  return (
    <AppLayout>
      <div>
        <h1 className="text-3xl font-bold">Kanban Board</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">Drag tasks between columns to update their status</p>

        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-slate-900/50" />
            ))}
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-4">
              {columns.map((col) => (
                <Droppable droppableId={col.id} key={col.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="min-h-[400px] rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900/30"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{col.label}</h3>
                        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600 dark:bg-white/10 dark:text-slate-400">
                          {tasks.filter((t) => t.status === col.id).length}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {tasks
                          .filter((t) => t.status === col.id)
                          .map((task, index) => (
                            <Draggable draggableId={task.id} index={index} key={task.id}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`group relative rounded-xl border border-slate-200 bg-white p-4 shadow-md transition-shadow dark:border-white/10 dark:bg-slate-900/70 ${
                                    snapshot.isDragging ? "shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500/30" : ""
                                  }`}
                                >
                                  <button
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="absolute right-2 top-2 rounded-md p-1 text-slate-500 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                                  >
                                    <X size={14} />
                                  </button>
                                  <p className="pr-5 text-sm font-medium text-slate-900 dark:text-white">{task.title}</p>
                                  <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{task.description}</p>
                                  <p className="mt-2 inline-block rounded-md bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-600 dark:text-cyan-400">
                                    {getProjectName(task.projectId)}
                                  </p>
                                  <div className="mt-3 flex items-center justify-between">
                                    <span className={`rounded-md px-2 py-1 text-xs font-medium capitalize ${priorityColors[task.priority]}`}>
                                      {task.priority}
                                    </span>
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-[10px] font-bold text-cyan-600 dark:text-cyan-400">
                                      {task.assignee.charAt(0).toUpperCase()}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>

                      <button
                        onClick={() => openAddDialog(col.id)}
                        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 py-2.5 text-xs font-medium text-slate-500 transition hover:border-cyan-500/40 hover:text-cyan-400 dark:border-white/10 dark:text-slate-400"
                      >
                        <Plus size={14} />
                        Add Task
                      </button>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        )}
      </div>

      <NewTaskDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={handleTaskCreated}
        defaultStatus={dialogStatus}
      />
    </AppLayout>
  );
}

export default Kanban;