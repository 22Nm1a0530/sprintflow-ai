import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import AppLayout from "../../components/layout/AppLayout";
import { fetchProjects, type Project } from "../../services/projectService";
import { fetchTasks, type Task } from "../../services/taskService";
import { FolderKanban, CheckCircle2, Clock, ListTodo } from "lucide-react";

function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchProjects(), fetchTasks()]).then(([projectData, taskData]) => {
      setProjects(projectData);
      setTasks(taskData);
      setLoading(false);
    });
  }, []);

  const activeProjects = projects.filter((p) => p.status === "active").length;
  const pendingTasks = tasks.filter((t) => t.status !== "done").length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const todaysTasks = tasks.filter((t) => t.status === "in_progress" || t.status === "review").length;

  const stats = [
    { label: "Active Projects", value: loading ? "-" : activeProjects, icon: FolderKanban, color: "text-cyan-400 bg-cyan-500/10" },
    { label: "Pending Tasks", value: loading ? "-" : pendingTasks, icon: ListTodo, color: "text-amber-400 bg-amber-500/10" },
    { label: "Completed Tasks", value: loading ? "-" : completedTasks, icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/10" },
    { label: "In Progress / Review", value: loading ? "-" : todaysTasks, icon: Clock, color: "text-purple-400 bg-purple-500/10" },
  ];

  return (
    <AppLayout>
      <div>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
<p className="mt-1 text-slate-500 dark:text-slate-400 capitalize">{user?.role.replace("_", " ")}</p>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 transition-colors hover:border-slate-300 dark:border-white/10 dark:bg-slate-900/50 dark:shadow-black/20 dark:hover:border-white/20"
              >
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon size={20} />
                </div>
                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>              </motion.div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}

export default Dashboard;