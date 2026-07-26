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

const PROJECTS_KEY = "sprintflow_projects";

const defaultProjects: Project[] = [
  { id: "1", name: "Mobile App Redesign", description: "Revamp the mobile app UI/UX for better engagement", status: "active", priority: "high", progress: 65, dueDate: "2026-08-15", membersCount: 5 },
  { id: "2", name: "API Migration", description: "Migrate legacy REST API to GraphQL", status: "active", priority: "medium", progress: 40, dueDate: "2026-09-01", membersCount: 3 },
  { id: "3", name: "Marketing Website", description: "Build new marketing landing pages", status: "completed", priority: "low", progress: 100, dueDate: "2026-07-01", membersCount: 4 },
  { id: "4", name: "Internal Analytics Tool", description: "Dashboard for tracking team KPIs", status: "on_hold", priority: "medium", progress: 20, dueDate: "2026-10-10", membersCount: 2 },
];

function getProjects(): Project[] {
  const raw = localStorage.getItem(PROJECTS_KEY);
  if (!raw) {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(defaultProjects));
    return defaultProjects;
  }
  return JSON.parse(raw);
}

function saveProjects(projects: Project[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export async function fetchProjects(): Promise<Project[]> {
  await new Promise((r) => setTimeout(r, 400));
  return getProjects();
}

export async function createProject(data: Omit<Project, "id">): Promise<Project> {
  await new Promise((r) => setTimeout(r, 400));
  const projects = getProjects();
  const newProject: Project = { ...data, id: crypto.randomUUID() };
  projects.push(newProject);
  saveProjects(projects);
  return newProject;
}

export async function deleteProject(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 300));
  const projects = getProjects().filter((p) => p.id !== id);
  saveProjects(projects);
}

export function getProjectsSync(): Project[] {
  return getProjects();
}

export function recalculateProjectProgress(projectId: string, allTasks: { projectId: string; status: string }[]) {
  const projects = getProjects();
  const project = projects.find((p) => p.id === projectId);
  if (!project) return;

  const projectTasks = allTasks.filter((t) => t.projectId === projectId);

  if (projectTasks.length === 0) {
    project.progress = 0;
  } else {
    const doneCount = projectTasks.filter((t) => t.status === "done").length;
    project.progress = Math.round((doneCount / projectTasks.length) * 100);
  }

  if (project.progress === 100) {
    project.status = "completed";
  } else if (project.progress === 0) {
    project.status = project.status === "completed" ? "active" : project.status;
  } else {
    project.status = project.status === "completed" ? "active" : project.status;
  }

  saveProjects(projects);
}