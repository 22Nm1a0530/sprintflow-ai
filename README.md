
# SprintFlow AI

**An AI-powered project management platform for software teams.** Plan projects, break work into tasks using AI, manage them on a Kanban board, and track progress with live analytics — all in one place.

🔗 **Live Application:** https://sprintflow-ai-eta.vercel.app
🔗 **Source Code:** https://github.com/22Nm1a0530/sprintflow-ai

---

## What This Project Is

Every software team needs a shared place to plan work, assign it, and track it through to completion. SprintFlow AI is that place — with one meaningful difference from a typical project tracker: instead of manually typing out every task by hand when starting new work, a user can **describe what they're building in plain English**, and an AI model instantly generates a realistic, ready-to-use task breakdown that drops straight onto the Kanban board.

This project was built end-to-end — frontend, AI integration, authentication, a real hosted database, automated deployment pipeline, and documentation — as a response to a technical assessment requiring exactly that scope.

---

## How to Explore This App (Recommended Walkthrough)

The fastest way to evaluate this project is to actually use it. Here is exactly what to click, in order, and what each screen demonstrates:

**1. Landing Page** (`/`)
The homepage. Shows an animated, auto-cycling preview of the actual app (Dashboard, Kanban, AI Generator, and Analytics screens), so you can see the product before signing up.

**2. Sign Up** (`/signup`)
Click **"Start Free"** or **"Get Demo"** from the landing page. Create an account with any name, email, and password, and choose a role — Developer, Project Manager, or Admin (see [Role-Based Access](#role-based-access-control) below for what changes per role).

**3. Dashboard** (`/dashboard`)
Right after signup, you'll land here. This is the home base — a summary of active projects, pending tasks, and overall progress, pulled from real data, not placeholders.

**Note on sample data:** to make the app immediately explorable rather than starting on a completely blank screen, every new account is seeded with a few sample projects and tasks out of the box. These are simply starter/demo content meant to showcase how the app looks and behaves once real work is added — feel free to edit, complete, or delete them, or create entirely new projects from scratch to test the full flow yourself.

**4. Projects** (`/projects`)
View existing (sample) projects, or click **"New Project"** to create your own — set a name, description, priority, and due date. Each project shows a live progress bar.

**5. Kanban Board** (`/kanban`)
The core workspace. Tasks are organized into four columns — **To Do → In Progress → Review → Done**. Drag any task card between columns to update its status; the linked project's progress bar updates automatically as a result — no manual syncing required.

**6. AI Task Generator** (`/ai-tools`)
This is the AI-powered centerpiece of the app. Select a project, type a short description of a feature you want to build (for example: *"add user notifications with email and in-app alerts"*), and the AI instantly generates a realistic set of tasks with priorities. Click **"Add to Kanban"** to drop them straight onto the board for that project.

**7. Analytics** (`/analytics`)
Real charts (not mockups) showing task completion trends over time and overall velocity, computed live from whatever tasks currently exist in your account.

**8. Settings** (`/settings`)
Edit your profile (name/email) and toggle between light and dark theme — your preference is remembered on future visits.

**9. Forgot Password** (from the Login page)
Click **"Forgot password?"** on the login screen, enter your email, and a real password reset email is sent (via EmailJS) to that inbox — not a simulated message. The reset link works from any device, including a phone, because account data is stored in a real cloud database rather than the browser alone (explained further below).

---

## Role-Based Access Control

SprintFlow AI supports three roles, chosen at signup:

- **Admin** and **Project Manager** — full access: create and manage projects, create and assign tasks
- **Developer** — can view, update, and move tasks on the Kanban board, but cannot create new projects or tasks — keeping project-level planning decisions with leads and managers, while developers focus on execution

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19 + TypeScript** | Core UI framework with compile-time type safety |
| **Vite** | Build tool and development server |
| **Tailwind CSS v4** | Utility-first styling |
| **shadcn/ui** | Accessible, pre-built UI primitives (dialogs, buttons, cards) |
| **Framer Motion** | Page transitions, hover states, and animated micro-interactions |
| **React Router DOM** | Client-side routing |
| **React Hook Form + Zod** | Form state management and schema validation |
| **Recharts** | Analytics charts |
| **@hello-pangea/dnd** | Drag-and-drop Kanban board |

### Data & Services
| Technology | Purpose |
|---|---|
| **Supabase** (hosted PostgreSQL) | Stores user accounts and password-reset tokens — the data that genuinely needs to work across multiple devices |
| **Browser localStorage** | Stores projects, tasks, and Kanban board state |
| **Groq API** (`llama-3.3-70b-versatile`) | Generates AI task suggestions from natural-language project descriptions |
| **EmailJS** | Sends real, templated password-reset emails directly from the frontend, with no email server to build or maintain |

### DevOps
| Technology | Purpose |
|---|---|
| **GitHub Actions** | Runs an automated build check (`npm ci && npm run build`) on every push to `main`, catching failures before they reach production |
| **Vercel** | Automatically builds and deploys the latest passing commit to the live URL, with environment variables managed centrally in its dashboard |

---

## Why the Architecture Is Split Between Supabase and localStorage

This is a deliberate, scoped engineering decision, not an inconsistency:

- **Accounts and password-reset tokens live in Supabase**, a real hosted database, because they have a hard requirement to work across devices — a user might request a password reset on a laptop and need to open that email and complete the reset on their phone. That's only possible if both devices read from the same shared database, rather than each device's own separate local browser storage.
- **Projects, tasks, and Kanban data live in localStorage** because, for the scope of this assessment, they don't carry that same cross-device requirement — a user manages their board from whichever device they're actively working on in a given session. This kept the majority of the app's data layer simple and fast to build, while still solving the one place where a shared backend was genuinely necessary.

A production version of this app would extend the same Supabase-backed approach to all data for full cross-device sync.

**Why Groq instead of Gemini?** The AI Task Generator originally used Google's Gemini API. During development, a quota restriction unrelated to the implementation made it unreliable for consistent use, so the integration was switched to Groq's API, which has been fast and stable in testing throughout the rest of the project.

---

## Project Structure


sprintflow-ai/
├── .github/
│   └── workflows/
│       └── ci.yml              — GitHub Actions CI pipeline (build check on every push)
├── src/
│   ├── components/             — Reusable UI: navbar, layout, dialogs, shadcn primitives
│   ├── context/                 — App-wide state: authentication session, theme (light/dark)
│   ├── lib/                     — Shared helper functions and form validation schemas
│   ├── pages/                   — Every screen in the app:
│   │   ├── Landing/                — Animated marketing homepage
│   │   ├── Auth/                    — Login, Signup, Forgot Password, Reset Password
│   │   ├── Dashboard/               — Home summary after login
│   │   ├── Projects/                — Project list and creation
│   │   ├── Kanban/                  — Drag-and-drop task board
│   │   ├── AITools/                 — AI Task Generator
│   │   ├── Analytics/               — Charts and progress tracking
│   │   ├── Settings/                — Profile and theme preferences
│   │   └── NotFound/                — Custom 404 page
│   ├── routes/
│   │   └── AppRoutes.tsx        — Maps every URL to its page
│   ├── services/                 — All external communication logic:
│   │   ├── authService.ts          — Signup, login, password reset (Supabase-backed)
│   │   ├── supabaseClient.ts       — Supabase connection setup
│   │   ├── emailService.ts         — Sends password reset emails (EmailJS)
│   │   ├── aiService.ts            — Calls Groq's AI model for task generation
│   │   ├── projectService.ts       — Project CRUD (localStorage-backed)
│   │   └── taskService.ts          — Task CRUD (localStorage-backed)
│   └── types/                    — Shared TypeScript type definitions
├── vercel.json                  — Tells Vercel to support client-side routing (see note below)
├── package.json
└── README.md


> **Note on `vercel.json`:** this app uses client-side routing (React Router). Without this file, directly visiting any URL other than the homepage on the deployed site (for example `/dashboard`) would return a 404, because Vercel's server would look for a matching physical file instead of letting React handle the route. This config tells Vercel to serve `index.html` for every path and let the app take over routing from there.

---

## Running It Locally

**Prerequisites:** Node.js 18+ and npm.

```bash
git clone https://github.com/22Nm1a0530/sprintflow-ai.git
cd sprintflow-ai
npm install
```

Create a `.env` file in the project root with your own keys:


VITE_GROQ_API_KEY=your_groq_api_key
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key


Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## CI/CD & Deployment

**Continuous Integration:** every push to `main` triggers a GitHub Actions workflow (`.github/workflows/ci.yml`) that installs dependencies and runs a full production build (`npm ci && npm run build`). Build failures are visible directly on GitHub before anything reaches production.

**Continuous Deployment:** Vercel is connected directly to this repository. Every successful push to `main` is automatically built and deployed to the live URL above — no manual deployment step required. Environment variables for all connected services (Groq, EmailJS, Supabase) are configured centrally in Vercel's dashboard, mirroring the local `.env` file.

---

## Known Limitations & Future Improvements

Being transparent about the tradeoffs made under a tight project timeline:

- **Passwords are stored as plain text** in the Supabase `users` table. A production system would hash passwords (e.g. with bcrypt) before storing them — this was a scope tradeoff, not an oversight, and would be the top priority for a "next version."
- **Projects and tasks don't yet sync across devices** — only accounts and password resets do (see [Architecture](#why-the-architecture-is-split-between-supabase-and-localstorage) above). Extending the same shared-database approach to all data is the natural next step.
- **Admin and Project Manager roles currently share identical permissions.** A future version would give Admins exclusive account-management and team-administration capabilities.
- **Settings notifications are currently a static visual display**, not a live notification system tied to real events.
- **No automated test suite yet** — manual, feature-by-feature testing was used throughout development given the project timeline; unit and integration tests (e.g. with Vitest) would be a natural next addition.

---

## Author

**Dalai Sai Deepika**
Built as a technical assessment submission.

