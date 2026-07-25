import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-slate-950 text-white">

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-20 top-10 h-[420px] w-[420px] rounded-full bg-cyan-500/20 blur-[140px]" />
        <div className="absolute -right-10 top-40 h-[350px] w-[350px] rounded-full bg-violet-500/20 blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[160px]" />
      </div>

      <section className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6 py-24">

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

            <div className="flex flex-row flex-wrap gap-6">

              <button className="min-w-[200px] rounded-2xl bg-cyan-500 px-10 py-5 text-lg font-bold shadow-xl shadow-cyan-500/30 transition-all duration-300 hover:scale-105 hover:bg-cyan-400">

                Start Free

              </button>

              <button className="min-w-[200px] flex items-center justify-center gap-3 rounded-2xl border border-slate-700 px-10 py-5 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:border-cyan-500">

                Live Demo

                <ArrowRight size={20} />

              </button>

            </div>

            <div style={{ height: "48px" }} />

            <div className="flex flex-col gap-6">

              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-cyan-400" />
                AI Sprint Planning
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-cyan-400" />
                Smart Tasks
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-cyan-400" />
                Analytics
              </div>

            </div>

          </motion.div>

          {/* RIGHT */}

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">

              <div className="mb-8 flex items-center justify-between">

                <div>

                  <p className="text-sm uppercase tracking-wider text-slate-400">
                    Active Sprint
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    Sprint 12
                  </h2>

                </div>

                <div className="rounded-2xl bg-cyan-500 px-5 py-3 text-lg font-bold">
                  82%
                </div>

              </div>

              <div className="space-y-6">

                <div className="rounded-2xl bg-slate-900 p-6">
                  <div className="mb-3 flex justify-between">
                    <span>Authentication Module</span>
                    <span className="text-green-400">Done</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-700">
                    <div className="h-2 w-full rounded-full bg-green-500" />
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-900 p-6">
                  <div className="mb-3 flex justify-between">
                    <span>AI Task Generator</span>
                    <span className="text-cyan-400">75%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-700">
                    <div className="h-2 w-3/4 rounded-full bg-cyan-500" />
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-900 p-6">
                  <div className="mb-3 flex justify-between">
                    <span>Deployment</span>
                    <span className="text-orange-400">Pending</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-700">
                    <div className="h-2 w-1/4 rounded-full bg-orange-500" />
                  </div>
                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </section>

    </div>
  );
}

export default HeroSection;