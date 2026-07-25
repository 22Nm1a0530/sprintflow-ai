function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">

      <div className="mx-auto max-w-7xl px-8 py-12">

        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">

          <div>

            <h2 className="text-2xl font-bold">

              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                SprintFlow AI
              </span>

            </h2>

            <p className="mt-3 max-w-md text-slate-400">
              AI-powered project management platform for modern software teams.
            </p>

          </div>

          <div className="flex gap-8 text-slate-400">

            <button className="transition hover:text-cyan-400">
              Privacy
            </button>

            <button className="transition hover:text-cyan-400">
              Terms
            </button>

            <button className="transition hover:text-cyan-400">
              Contact
            </button>

          </div>

        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-slate-500">

          © 2026 SprintFlow AI. All rights reserved.

        </div>

      </div>

    </footer>
  );
}

export default Footer;