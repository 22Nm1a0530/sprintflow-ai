import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { createTask, type Task } from "../../services/taskService";
import { fetchProjects, type Project } from "../../services/projectService";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (task: Task) => void;
  defaultStatus: Task["status"];
}

function NewTaskDialog({ open, onClose, onCreated, defaultStatus }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [projectId, setProjectId] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      fetchProjects().then((data) => {
        setProjects(data);
        if (data.length > 0) setProjectId(data[0].id);
      });
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !projectId) {
      setError("Please fill in task title and select a project.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const newTask = await createTask({
        title,
        description,
        priority,
        projectId,
        status: defaultStatus,
        assignee: "sai",
      });
      onCreated(newTask);
      setTitle("");
      setDescription("");
      setPriority("medium");
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">New Task</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Task Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fix login bug"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief task description"
              rows={2}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Project</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Task["priority"])}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
            >
              <option value="low" className="bg-slate-900">Low</option>
              <option value="medium" className="bg-slate-900">Medium</option>
              <option value="high" className="bg-slate-900">High</option>
            </select>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
              {error}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="mt-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 py-3 font-semibold shadow-lg shadow-cyan-500/25 transition hover:shadow-cyan-500/40 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Task"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default NewTaskDialog;