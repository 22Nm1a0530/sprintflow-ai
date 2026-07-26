import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AppLayout from "../../components/layout/AppLayout";
import NewProjectDialog from "../../components/projects/NewProjectDialog";
import { fetchProjects, deleteProject, type Project } from "../../services/projectService";
import { Calendar, Users, Plus, X } from "lucide-react";
const statusColors: Record<Project["status"], string> = {
  active: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  completed: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  on_hold: "text-amber-400 bg-amber-500/10 border-amber-500/20",
};

const priorityColors: Record<Project["priority"], string> = {
  high: "bg-red-500/10 text-red-400",
  medium: "bg-amber-500/10 text-amber-400",
  low: "bg-slate-500/10 text-slate-400",
};

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

 function handleProjectCreated(newProject: Project) {
    setProjects((prev) => [newProject, ...prev]);
  }

  async function handleDeleteProject(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    await deleteProject(id);
  }
  return (
    <AppLayout>
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="mt-1 text-slate-400">Manage and track all your projects</p>
          </div>
          <button
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 font-semibold text-white transition hover:scale-105 hover:bg-cyan-400"
          >
            <Plus size={18} />
            New Project
          </button>
        </div>

        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-2xl border border-white/10 bg-slate-900/50" />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl border border-white/10 bg-slate-900/50 p-6 shadow-lg shadow-black/20 transition-colors hover:border-white/20"
              >
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="absolute right-4 top-4 rounded-md p-1 text-slate-500 opacity-0 transition hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                >
                  <X size={16} />
                </button>
                <div className="flex items-start justify-between pr-6">
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                  <span className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${statusColors[project.status]}`}>
                    {project.status.replace("_", " ")}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-400 line-clamp-2">{project.description}</p>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {new Date(project.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={14} />
                    {project.membersCount} members
                  </div>
                  <span className={`rounded-md px-2 py-1 font-medium capitalize ${priorityColors[project.priority]}`}>
                    {project.priority}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <NewProjectDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={handleProjectCreated}
      />
    </AppLayout>
  );
}

export default Projects;