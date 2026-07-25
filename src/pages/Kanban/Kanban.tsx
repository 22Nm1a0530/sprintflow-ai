import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import AppLayout from "../../components/layout/AppLayout";
import { fetchTasks, updateTaskStatus, type Task } from "../../services/taskService";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks().then((data) => {
      setTasks(data);
      setLoading(false);
    });
  }, []);

  function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    const newStatus = result.destination.droppableId as Task["status"];
    const taskId = result.draggableId;

    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
    updateTaskStatus(taskId, newStatus);
  }

  return (
    <AppLayout>
      <div>
        <h1 className="text-3xl font-bold">Kanban Board</h1>
        <p className="mt-1 text-slate-400">Drag tasks between columns to update their status</p>

        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl border border-white/10 bg-slate-900/50" />
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
                      className="min-h-[400px] rounded-2xl border border-white/10 bg-slate-900/30 p-4"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-300">{col.label}</h3>
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-400">
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
                                  className={`rounded-xl border border-white/10 bg-slate-900/70 p-4 shadow-md transition-shadow ${
                                    snapshot.isDragging ? "shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500/30" : ""
                                  }`}
                                >
                                  <p className="text-sm font-medium">{task.title}</p>
                                  <p className="mt-1 line-clamp-2 text-xs text-slate-400">{task.description}</p>
                                  <div className="mt-3 flex items-center justify-between">
                                    <span className={`rounded-md px-2 py-1 text-xs font-medium capitalize ${priorityColors[task.priority]}`}>
                                      {task.priority}
                                    </span>
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-[10px] font-bold text-cyan-400">
                                      {task.assignee.charAt(0).toUpperCase()}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        )}
      </div>
    </AppLayout>
  );
}

export default Kanban;