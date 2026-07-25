import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Sparkles, ArrowRight, Rocket, Users, TrendingUp } from "lucide-react";
import { signupSchema, type SignupFormData } from "../../lib/validation";
import { signup } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function Signup() {
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: "developer" },
  });

  async function onSubmit(data: SignupFormData) {
    setServerError("");
    setLoading(true);
    try {
      const { user, token } = await signup(data.name, data.email, data.password, data.role);
      setAuth(user, token);
      navigate("/dashboard");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* LEFT — branding panel */}
      <div className="relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col lg:justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-slate-950 to-cyan-500/20" />
        <div className="absolute -left-32 top-20 h-[400px] w-[400px] rounded-full bg-violet-500/20 blur-[120px]" />
        <div className="absolute -bottom-20 right-0 h-[350px] w-[350px] rounded-full bg-cyan-500/20 blur-[120px]" />

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
            Join thousands of teams
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 bg-clip-text text-transparent">
              shipping faster.
            </span>
          </h2>
          <p className="mt-4 max-w-md text-slate-400">
            Create your free workspace and start planning smarter sprints today.
          </p>

          <div className="mt-10 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-slate-300">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15">
                <Rocket size={16} className="text-cyan-400" />
              </div>
              Set up your workspace in minutes
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15">
                <Users size={16} className="text-cyan-400" />
              </div>
              Collaborate with your entire team
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15">
                <TrendingUp size={16} className="text-cyan-400" />
              </div>
              Track velocity & productivity
            </div>
          </div>
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

          <h1 className="text-3xl font-bold">Create your account</h1>
          <p className="mt-2 text-slate-400">Start building with SprintFlow AI — free forever.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Full name</label>
              <input
                {...register("name")}
                placeholder="Jane Doe"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-500 focus:bg-white/[0.07] focus:ring-4 focus:ring-cyan-500/10"
              />
              {errors.name && <p className="mt-1.5 text-sm text-red-400">{errors.name.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Email address</label>
              <input
                type="email"
                {...register("email")}
                placeholder="you@company.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-500 focus:bg-white/[0.07] focus:ring-4 focus:ring-cyan-500/10"
              />
              {errors.email && <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
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
              {errors.password && <p className="mt-1.5 text-sm text-red-400">{errors.password.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">I am a...</label>
              <select
                {...register("role")}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-cyan-500 focus:bg-white/[0.07] focus:ring-4 focus:ring-cyan-500/10"
              >
                <option value="developer" className="bg-slate-900">Developer</option>
                <option value="project_manager" className="bg-slate-900">Project Manager</option>
                <option value="admin" className="bg-slate-900">Administrator</option>
              </select>
            </div>

            {serverError && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {serverError}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 py-3.5 font-semibold shadow-lg shadow-cyan-500/25 transition hover:shadow-cyan-500/40 disabled:opacity-50"
            >
              {loading ? "Creating account..." : (
                <>
                  Create Account <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-cyan-400 hover:underline">Log in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Signup;