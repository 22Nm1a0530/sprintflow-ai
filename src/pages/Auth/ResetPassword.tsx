import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Sparkles, ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { resetPasswordWithToken } from "../../services/authService";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("This reset link is missing a token.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await resetPasswordWithToken(token, password);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* LEFT — branding panel */}
      <div className="relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col lg:justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-slate-950 to-violet-600/20" />
        <div className="absolute -left-32 top-20 h-[400px] w-[400px] rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute -bottom-20 right-0 h-[350px] w-[350px] rounded-full bg-violet-500/20 blur-[120px]" />

        <Link to="/" className="relative z-10 flex items-center gap-2">
          <Sparkles className="text-cyan-400" size={26} />
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            SprintFlow AI
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10"
        >
          <h2 className="text-4xl font-extrabold leading-tight">
            Create a new
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 bg-clip-text text-transparent">
              password.
            </span>
          </h2>
          <p className="mt-4 max-w-md text-slate-400">
            Choose a strong password you haven't used before.
          </p>
        </motion.div>

        <p className="relative z-10 text-sm text-slate-500">© 2026 SprintFlow AI. All rights reserved.</p>
      </div>

      {/* RIGHT — form */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <Link to="/" className="mb-10 flex items-center gap-2 lg:hidden">
            <Sparkles className="text-cyan-400" size={22} />
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              SprintFlow AI
            </span>
          </Link>

          {!token ? (
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/15">
                <ShieldAlert className="text-red-400" size={32} />
              </div>
              <h1 className="mt-6 text-2xl font-bold">Invalid link</h1>
              <p className="mt-3 text-slate-400">
                This password reset link is missing or invalid. Please request a new one.
              </p>
              <Link
                to="/forgot-password"
                className="mt-6 text-sm font-medium text-cyan-400 hover:underline"
              >
                Request a new link
              </Link>
            </div>
          ) : success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/15">
                <CheckCircle2 className="text-cyan-400" size={32} />
              </div>
              <h1 className="mt-6 text-2xl font-bold">Password updated</h1>
              <p className="mt-3 text-slate-400">
                Your password has been changed successfully. Redirecting you to log in...
              </p>
            </motion.div>
          ) : (
            <>
              <h1 className="text-3xl font-bold">Set a new password</h1>
              <p className="mt-2 text-slate-400">Enter and confirm your new password below.</p>

              <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">New password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 pr-12 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-500 focus:bg-white/[0.07] focus:ring-4 focus:ring-cyan-500/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Confirm new password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-500 focus:bg-white/[0.07] focus:ring-4 focus:ring-cyan-500/10"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 py-3.5 font-semibold shadow-lg shadow-cyan-500/25 transition hover:shadow-cyan-500/40 disabled:opacity-50"
                >
                  {loading ? "Updating..." : (
                    <>
                      Update Password <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default ResetPassword;