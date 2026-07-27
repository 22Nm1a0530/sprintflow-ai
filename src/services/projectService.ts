import { supabase } from "./supabaseClient";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "completed" | "on_hold";
  priority: "low" | "medium" | "high";
  progress: number;
  dueDate: string;
  membersCount: number;
}

function mapRow(row: any): Project {
  return {
    id: String(row.id),
    name: row.name,
    description: row.description,
    status: row.status,
    priority: row.priority,
    progress: row.progress,
    dueDate: row.due_date,
    membersCount: row.members_count,
  };
}

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map(mapRow);
}

export async function createProject(data: Omit<Project, "id">): Promise<Project> {
  const { data: row, error } = await supabase
    .from("projects")
    .insert({
      name: data.name,
      description: data.description,
      status: data.status,
      priority: data.priority,
      progress: data.progress,
      due_date: data.dueDate,
      members_count: data.membersCount,
    })
    .select()
    .single();

  if (error || !row) {
    throw new Error("Failed to create project.");
  }

  return mapRow(row);
}

export async function deleteProject(id: string): Promise<void> {
  await supabase.from("projects").delete().eq("id", id);
}

export async function recalculateProjectProgress(
  projectId: string,
  allTasks: { projectId: string; status: string }[]
): Promise<void> {
  const projectTasks = allTasks.filter((t) => t.projectId === projectId);

  let progress = 0;
  if (projectTasks.length > 0) {
    const doneCount = projectTasks.filter((t) => t.status === "done").length;
    progress = Math.round((doneCount / projectTasks.length) * 100);
  }

  const { data: current } = await supabase
    .from("projects")
    .select("status")
    .eq("id", projectId)
    .maybeSingle();

  let newStatus = current?.status ?? "active";
  if (progress === 100) {
    newStatus = "completed";
  } else if (newStatus === "completed" && progress < 100) {
    newStatus = "active";
  }

  await supabase
    .from("projects")
    .update({ progress, status: newStatus })
    .eq("id", projectId);
}