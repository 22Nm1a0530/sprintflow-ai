import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import AppLayout from "../../components/layout/AppLayout";
import { fetchTasks, type Task } from "../../services/taskService";
import { TrendingUp, CheckCircle2, Clock } from "lucide-react";

function Analytics() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks().then((data) => {
      setTasks(data);
      setLoading(false);
    });
  }, []);

  const completedTasks = tasks.filter((t) => t.status === "done" && t.completedAt);
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  const today = new Date();
  const last7Days: { key: string; label: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    last7Days.push({
      key: d.toISOString().split("T")[0],
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
    });
  }

  const weeklyData = last7Days.map(({ key, label }) => {
    const count = completedTasks.filter((t) => t.completedAt!.split("T")[0] === key).length;
    return { day: label, completed: count };
  });

  let avgCompletionDays = "0";
  if (completedTasks.length > 0) {
    const earliestCompletion = completedTasks.reduce((earliest, t) => {
      const time = new Date(t.completedAt!).getTime();
      return time < earliest ? time : earliest;
    }, Infinity);
    const latestCompletion = completedTasks.reduce((latest, t) => {
      const time = new Date(t.completedAt!).getTime();
      return time > latest ? time : latest;
    }, 0);
    const spreadDays = (latestCompletion - earliestCompletion) / (1000 * 60 * 60 * 24);
    avgCompletionDays = spreadDays < 1 ? "Same day" : spreadDays.toFixed(1);
  }

  const summaryStats = [
    { label: "Total Tasks Completed", value: loading ? "-" : completedTasks.length, icon: CheckCircle2, color: "text-cyan-600 bg-cyan-100 dark:text-cyan-400 dark:bg-cyan-500/10" },
    { label: "Completion Span", value: loading ? "-" : avgCompletionDays, icon: Clock, color: "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/10" },
    { label: "Completion Rate", value: loading ? "-" : `${completionRate}%`, icon: TrendingUp, color: "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10" },
  ];

  return (
    <AppLayout>
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">Track team performance and productivity</p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {summaryStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 dark:border-white/10 dark:bg-slate-900/50 dark:shadow-black/20"
              >
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon size={20} />
                </div>
                <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 dark:border-white/10 dark:bg-slate-900/50 dark:shadow-black/20"
        >
          <h3 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">Tasks Completed — Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-white/10" />
              <XAxis dataKey="day" stroke="currentColor" className="text-slate-500 dark:text-slate-400" fontSize={12} />
              <YAxis stroke="currentColor" className="text-slate-500 dark:text-slate-400" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                labelStyle={{ color: "#fff" }}
              />
              <Bar dataKey="completed" fill="#22d3ee" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </AppLayout>
  );
}

export default Analytics;