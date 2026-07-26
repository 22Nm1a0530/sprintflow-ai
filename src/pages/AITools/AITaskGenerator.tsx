import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, Plus, CheckCircle2 } from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import { generateTasksFromDescription, type GeneratedTask } from "../../services/aiService";
import { createTask } from "../../services/taskService";
import { fetchProjects, type Project } from "../../services/projectService";

const priorityColors: Record<string, string> = {
  high: "bg-red-500/10 text-red-400",
  medium: "bg-amber-500/10 text-amber-400",
  low: "bg-slate-500/10 text-slate-400",
};

function AITaskGenerator() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedTasks, setGeneratedTasks] = useState<GeneratedTask[]>([]);
  const [addedIds, setAddedIds] = useState<number[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  useEffect(() => {
    fetchProjects().then((data) => {
      setProjects(data);
      if (data.length > 0) setSelectedProjectId(data[0].id);
    });
  }, []);

  async function handleGenerate() {
    if (!description.trim()) return;
    setError("");
    setLoading(true);
    setGeneratedTasks([]);
    try {
      const tasks = await generateTasksFromDescription(description);
      setGeneratedTasks(tasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTask(task: GeneratedTask, index: number) {
    if (!selectedProjectId) return;
    await createTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: "todo",
      assignee: "sai",
      projectId: selectedProjectId,
    });
    setAddedIds((prev) => [...prev, index]);
  }

  return (
    <AppLayout>
      <div className="max-w-3xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">AI Task Generator</h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Describe your project and let AI suggest tasks to get started.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 dark:border-white/10 dark:bg-slate-900/50 dark:shadow-black/20">
          <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
            Add generated tasks to project
          </label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="mb-5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id} className="bg-white dark:bg-slate-900">
                {p.name}
              </option>
            ))}
          </select>

          <label className="mb-2 block text-sm font-medium text-slate-600 dark:text-slate-300">
            Project description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. A food delivery app with real-time order tracking and payment integration"
            rows={4}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-white/[0.07]"
          />

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={loading || !description.trim()}
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:shadow-cyan-500/40 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Tasks
              </>
            )}
          </motion.button>

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500 dark:text-red-400">
              {error}
            </div>
          )}
        </div>

        <AnimatePresence>
          {generatedTasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-3"
            >
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Generated tasks ({generatedTasks.length})
              </h3>
              {generatedTasks.map((task, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{task.title}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{task.description}</p>
                  </div>
                  <div className="ml-4 flex items-center gap-3">
                    <span className={`rounded-md px-2 py-1 text-xs font-medium capitalize ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                    {addedIds.includes(index) ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={16} /> Added
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAddTask(task, index)}
                        className="flex items-center gap-1 rounded-lg bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-600 transition hover:bg-cyan-500/20 dark:text-cyan-400"
                      >
                        <Plus size={14} /> Add to Kanban
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}

export default AITaskGenerator;