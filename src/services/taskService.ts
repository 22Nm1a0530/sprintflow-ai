export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  assignee: string;
}

const TASKS_KEY = "sprintflow_tasks";

const defaultTasks: Task[] = [
  { id: "1", title: "Design login screen", description: "Create wireframes for the new login flow", status: "done", priority: "medium", assignee: "sai" },
  { id: "2", title: "Set up CI pipeline", description: "Configure GitHub Actions for build + lint", status: "in_progress", priority: "high", assignee: "sai" },
  { id: "3", title: "Write API documentation", description: "Document all REST endpoints", status: "todo", priority: "low", assignee: "sai" },
  { id: "4", title: "Fix navbar responsiveness", description: "Navbar breaks on tablet width", status: "review", priority: "medium", assignee: "sai" },
  { id: "5", title: "Add dark mode toggle", description: "Wire theme switch into settings page", status: "todo", priority: "medium", assignee: "sai" },
  { id: "6", title: "Optimize bundle size", description: "Reduce Vite build output size", status: "in_progress", priority: "low", assignee: "sai" },
];

function getTasks(): Task[] {
  const raw = localStorage.getItem(TASKS_KEY);
  if (!raw) {
    localStorage.setItem(TASKS_KEY, JSON.stringify(defaultTasks));
    return defaultTasks;
  }
  return JSON.parse(raw);
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export async function fetchTasks(): Promise<Task[]> {
  await new Promise((r) => setTimeout(r, 400));
  return getTasks();
}

export async function updateTaskStatus(id: string, status: Task["status"]): Promise<void> {
  const tasks = getTasks();
  const task = tasks.find((t) => t.id === id);
  if (task) task.status = status;
  saveTasks(tasks);
}