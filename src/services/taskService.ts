import { recalculateProjectProgress } from "./projectService";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  assignee: string;
  projectId: string;
  completedAt?: string;
}

const TASKS_KEY = "sprintflow_tasks";

const defaultTasks: Task[] = [
  { id: "1", title: "Design login screen", description: "Create wireframes for the new login flow", status: "done", priority: "medium", assignee: "sai", projectId: "1" },
  { id: "2", title: "Set up CI pipeline", description: "Configure GitHub Actions for build + lint", status: "in_progress", priority: "high", assignee: "sai", projectId: "1" },
  { id: "3", title: "Write API documentation", description: "Document all REST endpoints", status: "todo", priority: "low", assignee: "sai", projectId: "2" },
  { id: "4", title: "Fix navbar responsiveness", description: "Navbar breaks on tablet width", status: "review", priority: "medium", assignee: "sai", projectId: "1" },
  { id: "5", title: "Add dark mode toggle", description: "Wire theme switch into settings page", status: "todo", priority: "medium", assignee: "sai", projectId: "3" },
  { id: "6", title: "Optimize bundle size", description: "Reduce Vite build output size", status: "in_progress", priority: "low", assignee: "sai", projectId: "2" },
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

export async function fetchTasksByProject(projectId: string): Promise<Task[]> {
  await new Promise((r) => setTimeout(r, 200));
  return getTasks().filter((t) => t.projectId === projectId);
}

export async function updateTaskStatus(id: string, status: Task["status"]): Promise<void> {
  const tasks = getTasks();
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.status = status;
    if (status === "done") {
      task.completedAt = new Date().toISOString();
    } else {
      task.completedAt = undefined;
    }
    saveTasks(tasks);
    recalculateProjectProgress(task.projectId, tasks);
  }
}

export async function createTask(data: Omit<Task, "id">): Promise<Task> {
  await new Promise((r) => setTimeout(r, 300));
  const tasks = getTasks();
  const newTask: Task = { ...data, id: crypto.randomUUID() };
  tasks.push(newTask);
  saveTasks(tasks);
  recalculateProjectProgress(newTask.projectId, tasks);
  return newTask;
}

export async function deleteTask(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  const tasks = getTasks();
  const task = tasks.find((t) => t.id === id);
  const remaining = tasks.filter((t) => t.id !== id);
  saveTasks(remaining);
  if (task) {
    recalculateProjectProgress(task.projectId, remaining);
  }
}

export function getAllTasksSync(): Task[] {
  return getTasks();
}