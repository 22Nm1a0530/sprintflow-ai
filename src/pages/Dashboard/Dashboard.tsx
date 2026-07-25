import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import AppLayout from "../../components/layout/AppLayout";
import { FolderKanban, CheckCircle2, Clock, ListTodo } from "lucide-react";

function Dashboard() {
  const { user } = useAuth();

  const stats = [
    { label: "Active Projects", value: "4", icon: FolderKanban, color: "text-cyan-400 bg-cyan-500/10" },
    { label: "Pending Tasks", value: "12", icon: ListTodo, color: "text-amber-400 bg-amber-500/10" },
    { label: "Completed Tasks", value: "37", icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/10" },
    { label: "Today's Tasks", value: "3", icon: Clock, color: "text-purple-400 bg-purple-500/10" },
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
          <p className="mt-1 text-slate-400 capitalize">{user?.role.replace("_", " ")}</p>
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
                className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 shadow-lg shadow-black/20 transition-colors hover:border-white/20"
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
      </div>
    </AppLayout>
  );
}

export default Dashboard;