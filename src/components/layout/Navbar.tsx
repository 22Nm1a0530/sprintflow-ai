import { motion } from "framer-motion";

function Navbar() {
  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">

        <h1 className="text-2xl font-bold tracking-wide">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            SprintFlow AI
          </span>
        </h1>

        <div className="hidden items-center gap-10 text-slate-300 md:flex">

          <button className="transition hover:text-cyan-400">
            Features
          </button>

          <button className="transition hover:text-cyan-400">
            Solutions
          </button>

          <button className="transition hover:text-cyan-400">
            Pricing
          </button>

          <button className="transition hover:text-cyan-400">
            Contact
          </button>

        </div>

        <button className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold transition-all duration-300 hover:scale-105 hover:bg-cyan-400">
          Get Started
        </button>

      </div>
    </motion.nav>
  );
}

export default Navbar;