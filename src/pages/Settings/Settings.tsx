import { motion } from "framer-motion";
import { Moon, Sun, User, Bell } from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <AppLayout>
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-1 text-slate-400">Manage your account and preferences</p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8 max-w-2xl space-y-6"
        >
          <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 shadow-lg shadow-black/20">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                <User size={20} />
              </div>
              <h3 className="text-lg font-semibold">Profile</h3>
            </div>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-slate-400">Name</span>
                <span className="font-medium">{user?.name}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-slate-400">Email</span>
                <span className="font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Role</span>
                <span className="font-medium capitalize">{user?.role.replace("_", " ")}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 shadow-lg shadow-black/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                  {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Appearance</h3>
                  <p className="text-sm text-slate-400">Switch between light and dark mode</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative h-8 w-14 rounded-full transition-colors ${theme === "dark" ? "bg-cyan-500" : "bg-slate-600"}`}
              >
                <motion.div
                  animate={{ x: theme === "dark" ? 26 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-1 h-6 w-6 rounded-full bg-white shadow-md"
                />
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 shadow-lg shadow-black/20">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <Bell size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Notifications</h3>
                <p className="text-sm text-slate-400">Email alerts for task updates are enabled</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}

export default Settings;