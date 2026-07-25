import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import AppLayout from "../../components/layout/AppLayout";
import { TrendingUp, CheckCircle2, Clock } from "lucide-react";

const weeklyData = [
  { day: "Mon", completed: 4 },
  { day: "Tue", completed: 7 },
  { day: "Wed", completed: 5 },
  { day: "Thu", completed: 9 },
  { day: "Fri", completed: 6 },
  { day: "Sat", completed: 3 },
  { day: "Sun", completed: 2 },
];

const summaryStats = [
  { label: "Tasks This Week", value: "36", icon: CheckCircle2, color: "text-cyan-400 bg-cyan-500/10" },
  { label: "Avg. Completion Time", value: "2.4 days", icon: Clock, color: "text-amber-400 bg-amber-500/10" },
  { label: "Team Velocity", value: "+18%", icon: TrendingUp, color: "text-emerald-400 bg-emerald-500/10" },
];

function Analytics() {
  return (
    <AppLayout>
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="mt-1 text-slate-400">Track team performance and productivity</p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {summaryStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 shadow-lg shadow-black/20"
              >
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon size={20} />
                </div>
                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-6 rounded-2xl border border-white/10 bg-slate-900/50 p-6 shadow-lg shadow-black/20"
        >
          <h3 className="mb-6 text-lg font-semibold">Tasks Completed This Week</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} />
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