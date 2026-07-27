import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Shield, Trash2 } from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import { fetchAllUsers, updateUserRole, deleteUserAccount } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import type { User, UserRole } from "../../types/auth";
const roleColors: Record<UserRole, string> = {
  admin: "bg-red-500/10 text-red-500 dark:text-red-400",
  project_manager: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  developer: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
};

function TeamMembers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  

  // ADD THIS SECTION:
  if (currentUser?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <div>
          <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
          <p className="text-slate-400">Only admins can access this page.</p>
        </div>
      </div>
    );
  }
async function loadUsers() {
    try {
      setLoading(true);
      const allUsers = await fetchAllUsers();
      setUsers(allUsers);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);
if (currentUser?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <div>
          <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
          <p className="text-slate-400">Only admins can access this page.</p>
        </div>
      </div>
    );
  }

 
  useEffect(() => {
    fetchAllUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  async function handleRoleChange(userId: string, newRole: UserRole) {
    setUpdatingId(userId);
    try {
      await updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch {
      // ignore
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(userId: string) {
    setUpdatingId(userId);
    try {
      await deleteUserAccount(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setConfirmDeleteId(null);
    } catch {
      // ignore
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <AppLayout>
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-500">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Team Members</h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Manage roles and access for everyone on your team
            </p>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900/50" />
            ))}
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 dark:border-white/10 dark:bg-slate-900/50 dark:shadow-black/20">
            {users.map((u, index) => (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between border-b border-slate-100 p-4 last:border-b-0 dark:border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-sm font-bold text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{u.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{u.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${roleColors[u.role]}`}>
                    {u.role.replace("_", " ")}
                  </span>
                  <select
                    value={u.role}
                    disabled={updatingId === u.id || currentUser?.id === u.id}
                    onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                    title={currentUser?.id === u.id ? "Promote another admin before changing your own role" : undefined}
                    className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs outline-none focus:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="developer">Developer</option>
                    <option value="project_manager">Project Manager</option>
                    <option value="admin">Administrator</option>
                  </select>

                  {currentUser?.id !== u.id && (
                    confirmDeleteId === u.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleDelete(u.id)}
                          disabled={updatingId === u.id}
                          className="rounded-lg bg-red-500 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-50"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(u.id)}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    )
                  )}
                </div>
              </motion.div>
            ))}

            {users.length === 0 && (
              <div className="flex flex-col items-center gap-2 p-12 text-center">
                <Users className="text-slate-300 dark:text-slate-600" size={32} />
                <p className="text-sm text-slate-500 dark:text-slate-400">No team members found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default TeamMembers;