import { supabase } from "./supabaseClient";
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

function mapRow(row: any): Task {
  return {
    id: String(row.id),
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    assignee: row.assignee,
    projectId: String(row.project_id),
    completedAt: row.completed_at ?? undefined,
  };
}

export async function fetchTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map(mapRow);
}

export async function fetchTasksByProject(projectId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", projectId);

  if (error || !data) {
    return [];
  }

  return data.map(mapRow);
}

export async function updateTaskStatus(id: string, status: Task["status"]): Promise<void> {
  const completedAt = status === "done" ? new Date().toISOString() : null;

  const { data: updated, error } = await supabase
    .from("tasks")
    .update({ status, completed_at: completedAt })
    .eq("id", id)
    .select()
    .single();

  if (error || !updated) return;

  const allTasks = await fetchTasks();
  await recalculateProjectProgress(String(updated.project_id), allTasks);
}

export async function createTask(data: Omit<Task, "id">): Promise<Task> {
  const { data: row, error } = await supabase
    .from("tasks")
    .insert({
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      assignee: data.assignee,
      project_id: data.projectId,
    })
    .select()
    .single();

  if (error || !row) {
    throw new Error("Failed to create task.");
  }

  const allTasks = await fetchTasks();
  await recalculateProjectProgress(data.projectId, allTasks);

  return mapRow(row);
}

export async function deleteTask(id: string): Promise<void> {
  const { data: existing } = await supabase
    .from("tasks")
    .select("project_id")
    .eq("id", id)
    .maybeSingle();

  await supabase.from("tasks").delete().eq("id", id);

  if (existing) {
    const allTasks = await fetchTasks();
    await recalculateProjectProgress(String(existing.project_id), allTasks);
  }
}