import { useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, User, Bell, Pencil, Check, X } from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { updateUserProfile } from "../../services/authService";

function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function startEditing() {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setError("");
    setSuccess(false);
    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);
    setError("");
  }

  async function handleSave() {
    if (!user) return;
    if (!name.trim() || !email.trim()) {
      setError("Name and email cannot be empty.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const updated = await updateUserProfile(user.id, { name, email });
      localStorage.setItem("sprintflow_user", JSON.stringify(updated));
      setEditing(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        window.location.reload();
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppLayout>
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">Manage your account and preferences</p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8 max-w-2xl space-y-6"
        >
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 dark:border-white/10 dark:bg-slate-900/50 dark:shadow-black/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                  <User size={20} />
                </div>
                <h3 className="text-lg font-semibold">Profile</h3>
              </div>
              {!editing && (
                <button
                  onClick={startEditing}
                  className="flex items-center gap-1.5 rounded-lg bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-600 transition hover:bg-cyan-500/20 dark:text-cyan-400"
                >
                  <Pencil size={13} /> Edit
                </button>
              )}
            </div>

            {editing ? (
              <div className="mt-5 flex flex-col gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-500 dark:text-red-400">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:shadow-cyan-500/40 disabled:opacity-50"
                  >
                    <Check size={15} /> {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                  >
                    <X size={15} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-5 space-y-3 text-sm">
                {success && (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-600 dark:text-emerald-400">
                    Profile updated successfully.
                  </div>
                )}
                <div className="flex justify-between border-b border-slate-100 pb-3 dark:border-white/5">
                  <span className="text-slate-500 dark:text-slate-400">Name</span>
                  <span className="font-medium">{user?.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-3 dark:border-white/5">
                  <span className="text-slate-500 dark:text-slate-400">Email</span>
                  <span className="font-medium">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Role</span>
                  <span className="font-medium capitalize">{user?.role.replace("_", " ")}</span>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 dark:border-white/10 dark:bg-slate-900/50 dark:shadow-black/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                  {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Appearance</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Switch between light and dark mode</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative h-8 w-14 rounded-full transition-colors ${theme === "dark" ? "bg-cyan-500" : "bg-slate-300"}`}
              >
                <motion.div
                  animate={{ x: theme === "dark" ? 26 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-1 h-6 w-6 rounded-full bg-white shadow-md"
                />
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 dark:border-white/10 dark:bg-slate-900/50 dark:shadow-black/20">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                <Bell size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Notifications</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Email alerts for task updates are enabled</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}

export default Settings;