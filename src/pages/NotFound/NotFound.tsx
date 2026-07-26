import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Home } from "lucide-react";

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/15">
          <Sparkles className="text-cyan-400" size={32} />
        </div>
        <h1 className="text-6xl font-extrabold tracking-tight">404</h1>
        <p className="mt-4 text-xl font-semibold">Page not found</p>
        <p className="mt-2 max-w-md text-slate-400">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 font-semibold shadow-lg shadow-cyan-500/25 transition hover:shadow-cyan-500/40"
        >
          <Home size={18} />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}

export default NotFound;