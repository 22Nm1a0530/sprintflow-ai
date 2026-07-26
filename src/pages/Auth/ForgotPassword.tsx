import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { requestPasswordReset } from "../../services/authService";
import { sendPasswordResetEmail } from "../../services/emailService";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!validEmail) {
      setError("Enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const token = await requestPasswordReset(email);

      if (token) {
        const resetLink = `${window.location.origin}/reset-password?token=${token}`;
        await sendPasswordResetEmail(email, resetLink);
      }
      // Always show the same success screen whether or not the account exists —
      // this avoids revealing which emails are registered.
      setSubmitted(true);
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
            Forgot your
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 bg-clip-text text-transparent">
              password?
            </span>
          </h2>
          <p className="mt-4 max-w-md text-slate-400">
            No problem. Enter the email on your account and we'll send you a link to reset it.
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

          {!submitted ? (
            <>
              <h1 className="text-3xl font-bold">Reset password</h1>
              <p className="mt-2 text-slate-400">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-500 focus:bg-white/[0.07] focus:ring-4 focus:ring-cyan-500/10"
                  />
                  {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 py-3.5 font-semibold shadow-lg shadow-cyan-500/25 transition hover:shadow-cyan-500/40 disabled:opacity-50"
                >
                  {loading ? "Sending..." : (
                    <>
                      Send Reset Link <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/15">
                <CheckCircle2 className="text-cyan-400" size={32} />
              </div>
              <h1 className="mt-6 text-2xl font-bold">Check your email</h1>
              <p className="mt-3 text-slate-400">
                If an account exists for <span className="text-white">{email}</span>, we've sent a
                password reset link to that address.
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
                <Mail size={16} />
                Didn't get it? Check your spam folder.
              </div>
            </motion.div>
          )}

          <Link
            to="/login"
            className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-cyan-400"
          >
            <ArrowLeft size={16} />
            Back to log in
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default ForgotPassword;