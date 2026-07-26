import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, CheckCircle2, LayoutDashboard, Kanban, Bot, BarChart3 } from "lucide-react";

const screens = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "kanban", label: "Kanban Board", icon: Kanban },
  { key: "ai", label: "AI Task Generator", icon: Bot },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
];

function DashboardScreen() {
  const stats = [
    { label: "Active Projects", value: "8", icon: LayoutDashboard, color: "text-cyan-400 bg-cyan-500/15" },
    { label: "Tasks Done", value: "142", icon: CheckCircle2, color: "text-green-400 bg-green-500/15" },
    { label: "In Progress", value: "23", icon: BarChart3, color: "text-violet-400 bg-violet-500/15" },
    { label: "AI Suggestions", value: "56", icon: Sparkles, color: "text-blue-400 bg-blue-500/15" },
  ];
  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-white/10 bg-slate-800/60 p-4"
          >
            <div className={`mb-2 inline-flex rounded-lg p-2 ${s.color}`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-slate-400">{s.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

function KanbanScreen() {
  const columns = [
    { title: "To Do", color: "border-slate-600", cards: ["Design login page", "Set up database"] },
    { title: "In Progress", color: "border-cyan-500", cards: ["Build API routes", "AI integration"] },
    { title: "Done", color: "border-green-500", cards: ["Project setup"] },
  ];
  return (
    <div className="grid grid-cols-3 gap-3">
      {columns.map((col, ci) => (
        <div key={col.title} className="rounded-lg bg-slate-800/50 p-2">
          <p className="mb-2 px-1 text-xs font-semibold text-slate-400">{col.title}</p>
          <div className="flex flex-col gap-2">
            {col.cards.map((card, i) => (
              <motion.div
                key={card}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: ci * 0.15 + i * 0.1 }}
                className={`rounded-lg border-l-2 ${col.color} bg-slate-900/80 p-2 text-xs`}
              >
                {card}
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AIScreen() {
  const tasks = ["Set up auth flow", "Create task schema", "Build Kanban UI", "Add drag-and-drop", "Write API docs"];
  return (
    <div>
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-slate-300">
        <Sparkles className="text-cyan-400" size={16} />
        Build a task management dashboard...
      </div>
      <div className="flex flex-col gap-2">
        {tasks.map((t, i) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.15 }}
            className="flex items-center gap-2 rounded-lg bg-slate-800/40 px-3 py-2 text-xs"
          >
            <CheckCircle2 className="text-green-400" size={14} />
            {t}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsScreen() {
  const bars = [45, 70, 55, 90, 65, 100, 80];
  return (
    <div>
      <p className="mb-4 text-sm font-semibold text-slate-300">Weekly Task Completion</p>
      <div className="flex items-end gap-3" style={{ height: "180px" }}>
        {bars.map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-t-lg bg-gradient-to-t from-cyan-500 to-violet-500"
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
          />
        ))}
      </div>
    </div>
  );
}

function LandingPage() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % screens.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden bg-slate-950 text-white">

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-20 top-10 h-[420px] w-[420px] rounded-full bg-cyan-500/20 blur-[140px]" />
        <div className="absolute -right-10 top-40 h-[350px] w-[350px] rounded-full bg-violet-500/20 blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[160px]" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 py-24">
        <div className="grid w-full items-center gap-24 lg:grid-cols-2">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-sm">
              <Sparkles size={18} />
              AI Powered Agile Platform
            </div>

            <h1 className="mt-8 text-4xl font-extrabold leading-tight tracking-tight lg:text-6xl">
              Build Software
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 bg-clip-text text-transparent">
                Faster With AI
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-xl leading-8 text-slate-300">
              SprintFlow AI helps software teams plan sprints, manage tasks,
              collaborate effortlessly, and accelerate development using
              intelligent AI automation.
            </p>

            <div style={{ height: "48px" }} />

            <div className="flex flex-row flex-nowrap items-center gap-6">
              <Link
                to="/signup"
                className="min-w-[200px] whitespace-nowrap rounded-2xl bg-cyan-500 px-10 py-5 text-lg font-bold shadow-xl shadow-cyan-500/30 transition-all duration-300 hover:scale-105 hover:bg-cyan-400 text-center"
              >
                Start Free
              </Link>

              <Link
                to="/signup"
                className="min-w-[200px] flex items-center justify-center gap-3 whitespace-nowrap rounded-2xl border border-slate-700 px-10 py-5 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:border-cyan-500"
              >
                Get Demo
                <ArrowRight size={20} />
              </Link>
            </div>

            <div style={{ height: "48px" }} />

            <div className="flex flex-col items-start gap-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-cyan-400" size={18} />
                <span>AI Sprint Planning</span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-cyan-400" size={18} />
                <span>Smart Tasks</span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-cyan-400" size={18} />
                <span>Analytics</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
            style={{ perspective: "1200px" }}
          >
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-violet-500/20 blur-3xl" />

           <div
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl"
              style={{ height: "400px" }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={screens[active].key}
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0 flex flex-col"
                >
                  <div className="flex items-center gap-2 border-b border-white/10 bg-slate-950/60 px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-400/70" />
                      <div className="h-3 w-3 rounded-full bg-yellow-400/70" />
                      <div className="h-3 w-3 rounded-full bg-green-400/70" />
                    </div>
                    <div className="ml-3 flex-1 rounded-md bg-slate-800/80 px-3 py-1 text-xs text-slate-400">
                      sprintflow.ai/{screens[active].key}
                    </div>
                  </div>

                  <div className="flex-1 overflow-hidden p-6">
                    {screens[active].key === "dashboard" && <DashboardScreen />}
                    {screens[active].key === "kanban" && <KanbanScreen />}
                    {screens[active].key === "ai" && <AIScreen />}
                    {screens[active].key === "analytics" && <AnalyticsScreen />}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            {/* Tab indicators */}
            <div className="mt-6 flex justify-center gap-3">
              {screens.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.key}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs transition-all duration-300 ${
                      i === active
                        ? "border-cyan-400/50 bg-cyan-500/15 text-cyan-300"
                        : "border-white/10 bg-slate-800/40 text-slate-500"
                    }`}
                  >
                    <Icon size={14} />
                    {s.label}
                  </div>
                );
              })}
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
}

export default LandingPage;