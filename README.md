# SprintFlow AI

**An AI-powered project management platform for software teams** — plan projects, break work into tasks with AI, track it all on a Kanban board, and monitor progress with live analytics.

🔗 **Live App:** https://sprintflow-ai-eta.vercel.app
🔗 **Source Code:** https://github.com/22Nm1a0530/sprintflow-ai

---

## Overview

Every software team eventually needs the same thing: a shared place to plan work, assign it, and track it to completion. SprintFlow AI provides that — with one meaningful difference from a typical project tracker: instead of manually typing out every task when starting a new feature, a user can **describe what they're building in plain English**, and an AI model instantly generates a realistic, ready-to-use task breakdown, which drops straight onto the Kanban board.

**Core flow:** Sign up → create a project → describe a feature to the AI Task Generator → tasks appear instantly → manage them on the Kanban board → watch project progress and analytics update automatically as work moves forward.

The project was built as a response to a technical assessment with the following requirements: build a web app with real business value using AI, version control it on Git, set up CI/CD, deploy it, and document it — all of which are demonstrated below.

---

## Feature Breakdown

### Authentication & Accounts
- Email/password signup and login, with per-role account creation (Developer, Project Manager, Admin)
- **Real password reset flow** — requesting a reset sends an actual email (via EmailJS) containing a secure, time-limited token. Clicking the link opens a reset page that works from *any device*, not just the one the request originated from — this required moving account data to a real hosted database (see [Architecture](#architecture-decisions) below for why)
- Protected routes — the app redirects unauthenticated users away from internal pages automatically

### Role-Based Access Control
- **Admin / Project Manager** — full access: create projects, create tasks, manage the team's work
- **Developer** — can view and update tasks (move them across the Kanban board, mark progress) but cannot create new projects or tasks, keeping project-level decisions with leads/managers

### Projects
- Create, view, and manage multiple projects, each with a priority level, due date, and description
- Project progress bars **update automatically** — as tasks tied to a project move to "Done" on the Kanban board, the project's completion percentage recalculates with no manual step

### Kanban Board
- Four-column workflow: To Do → In Progress → Review → Done
- Full drag-and-drop task management, task creation scoped to a specific project, and one-click task deletion

### AI Task Generator
- Powered by Groq's hosted LLM (`llama-3.3-70b-versatile`)
- Describe a feature or project in a sentence or two, and the AI returns a set of concrete, relevant tasks
- Generated tasks can be added directly to the selected project's Kanban board in one click

### Analytics Dashboard
- Live charts (via Recharts) showing task completion trends and project velocity, computed from real task data — not placeholder numbers

### Settings & Profile
- Editable name/email, with light/dark theme toggle persisted across sessions

### Error Handling
- Custom 404 page for any unmatched route, keeping navigation graceful instead of showing a blank or broken screen

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19 + TypeScript** | Core UI framework with compile-time type safety |
| **Vite** | Build tool and dev server |
| **Tailwind CSS v4** | Utility-first styling |
| **shadcn/ui** | Accessible, pre-built UI primitives (dialogs, buttons, cards) |
| **Framer Motion** | Page transitions, hover states, and micro-interactions |
| **React Router DOM** | Client-side routing |
| **React Hook Form + Zod** | Form state management and schema validation |
| **Recharts** | Analytics charts |
| **@hello-pangea/dnd** | Drag-and-drop Kanban board |

### Data & Services
| Technology | Purpose |
|---|---|
| **Supabase** (hosted PostgreSQL) | Stores user accounts and password-reset tokens — the only data that genuinely needs to be shared across devices |
| **Browser localStorage** | Stores projects, tasks, and Kanban state |
| **Groq API** (`llama-3.3-70b-versatile`) | Generates AI task suggestions from natural-language project descriptions |
| **EmailJS** | Sends real, templated password-reset emails directly from the frontend, with no email server to maintain |

### DevOps
| Technology | Purpose |
|---|---|
| **GitHub Actions** | Runs an automated build check (`npm ci && npm run build`) on every push to `main`, catching build failures before they reach production |
| **Vercel** | Auto-deploys the latest passing build to the live URL, with environment variables managed centrally in its dashboard |

---

## Architecture Decisions

**Why is data split between Supabase and localStorage instead of one or the other?**

This was a deliberate, scoped decision rather than an inconsistency:

- **Accounts and password-reset tokens live in Supabase** because they have a hard requirement to work across devices. A user might request a password reset on a laptop and open the confirmation email on their phone — that only works if both devices are reading from the same shared database, not each device's own local browser storage.
- **Projects, tasks, and Kanban data live in localStorage** because, for the scope of this assessment, they don't carry that same cross-device requirement — a user manages their board from whichever device they're actively working on. This kept the majority of the app's data layer simple and fast to build, while still solving the one place where a shared backend was genuinely necessary.

A production version of this app would move everything to Supabase (or an equivalent backend) for full cross-device sync of all data, not just accounts.

**Why Groq instead of Gemini?**

The AI Task Generator originally used Google's Gemini API. During development, a quota restriction unrelated to the implementation made Gemini unreliable for consistent use, so the integration was switched to Groq's API, which has been stable and fast in testing. The Gemini SDK dependency remains installed but unused — a visible trace of that decision rather than something hidden.

---

## Project Structure
sprintflow-ai/
├── vercel.json # SPA routing config for Vercel (see note below)
├── .github/
│ └── workflows/
│ └── ci.yml # GitHub Actions CI pipeline
└── frontend/
├── .env # API keys (gitignored, not committed)
├── src/
│ ├── components/ # Reusable UI: navbar, layout, dialogs, shadcn primitives
│ ├── context/ # App-wide state: auth session, theme
│ ├── lib/ # Shared helpers and form validation schemas
│ ├── pages/ # Every screen — Landing, Auth, Dashboard, Kanban, Projects, Analytics, Settings, NotFound
│ ├── routes/ # Route definitions (AppRoutes.tsx)
│ ├── services/ # All external communication: Supabase, Groq AI, EmailJS, and localStorage-backed project/task logic
│ └── types/ # Shared TypeScript types
└── package.json


> **Note on `vercel.json`:** this app uses client-side routing (React Router). Without this config, directly visiting any URL other than the homepage (e.g. `/dashboard`) on the deployed site would return a 404, because Vercel's server would look for a matching file instead of letting React handle the route. This file tells Vercel to serve `index.html` for all paths and let the app take over routing from there.

---

## Running It Locally

**Prerequisites:** Node.js 18+ and npm.

```bash
git clone https://github.com/22Nm1a0530/sprintflow-ai.git
cd sprintflow-ai/frontend
npm install
```

Create a `.env` file inside the `frontend` folder:

VITE_GROQ_API_KEY=your_groq_api_key
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key


Start the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## CI/CD & Deployment

**Continuous Integration:** every push to `main` triggers a GitHub Actions workflow (`.github/workflows/ci.yml`) that installs dependencies and runs a production build (`npm ci && npm run build`). If the build fails, the failure is visible directly on GitHub before anything reaches production.

**Continuous Deployment:** Vercel is connected directly to this repository. Every successful push to `main` is automatically built and deployed to the live URL above — no manual deployment step is required. Environment variables for all connected services (Groq, EmailJS, Supabase) are configured in Vercel's dashboard, mirroring the local `.env` file.

---

## Known Limitations & Future Improvements

Being transparent about tradeoffs made under a tight timeline:

- **Passwords are stored as plain text** in the Supabase `users` table. A production system would hash passwords (e.g. with bcrypt) before storing them — this was a scope tradeoff, not an oversight, and is the top priority for a "next version."
- **Projects and tasks don't yet sync across devices** — only accounts do (see [Architecture Decisions](#architecture-decisions)). A full migration to a shared backend for all data is the natural next step.
- **Admin and Project Manager roles currently share identical permissions.** A future version would give Admins exclusive account-management and team-administration capabilities.
- **Settings notifications are currently a static visual display**, not a live notification system tied to real events.
- **No automated test suite yet** — manual testing was used throughout development given the project timeline; unit and integration tests (e.g. with Vitest) would be a natural addition.

---

## Author

**Dalai Sai Deepika**
Built as a technical assessment submission.