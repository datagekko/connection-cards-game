# Tech Stack Overview

Welcome to the **Connection-Cards** codebase! This document provides a high-level overview of the technologies in use and how they fit together. It is aimed at helping new contributors ramp up quickly.

---

## 📦 Project at a Glance

| Layer      | Primary Tech | Role |
|------------|--------------|------|
| Frontend   | **TypeScript&nbsp;+&nbsp;React 19** powered by **Vite 6** | Interactive single-page application (SPA) delivered to the browser |
| Backend    | _Pending / To Be Defined_ | API & business-logic layer (not yet implemented) |
| Database   | _Pending / To Be Defined_ | Persistent data storage (not yet implemented) |

> **Note** At the time of writing, only the frontend is present in the repository. The backend and database layers are placeholders that can be fleshed out as the project evolves.

---

## 🎨 Frontend

### TypeScript
* Strongly-typed superset of JavaScript used throughout the codebase (`.ts`/`.tsx` files)
* Enforced by `tsconfig.json` (strict mode enabled)

### React 19
* Declarative UI library
* Functional components with hooks (see `components/` directory)

### Vite 6
* Modern, fast dev server and bundler
* Key scripts (see `package.json`):
  * `npm run dev` – starts the hot-reload dev server
  * `npm run build` – produces an optimized production build in `dist/`
  * `npm run preview` – serves the build locally for final checks
* `vite.config.ts` exposes environment variables (e.g. `GEMINI_API_KEY`) and aliases `@/*` to the repo root for cleaner imports

### Project Structure (Frontend)
```
connection-cards/
├─ components/        # Reusable UI + game logic
├─ constants/         # Static data (e.g. questions)
├─ types.ts           # Shared application types
├─ index.tsx          # React entry point
└─ vite.config.ts     # Build / dev-server config
```

### Potential UI Enhancements
* **shadcn/ui** – Utility components built on Radix UI & Tailwind; would accelerate styling and ensure accessible, themeable UI components.
* **Tailwind CSS** – If adopted (and required by shadcn/ui), can be integrated via the official Vite plugin in a few minutes.

---

## ⚙️ Backend (Future Work)
The repository currently has no server-side code. Depending on project needs, you could:

1. **Node.js + Express / Fastify** – Quick REST or GraphQL API.
2. **tRPC / Next.js API routes** – End-to-end type-safe APIs that pair nicely with TypeScript frontend.
3. **Serverless Functions (Vercel, Netlify, Cloudflare Workers)** – Lightweight, scalable backend without managing servers.

Whichever route is chosen, consider code-gen or shared type libraries to keep client & server contracts in sync.

---

## 🗄️ Database (Future Work)
A database layer is not yet present. Options include:

* **PostgreSQL + Prisma** – Robust SQL database with a type-safe ORM.
* **PlanetScale (MySQL) + Kysely** – Serverless MySQL with query-builder generated types.
* **SQLite** – Simple local DB for quick prototyping.

Regardless of choice, aim to containerize local development (e.g. Docker Compose) and use migration tools to track schema changes.

---

## 🛠️ Tooling & Developer Experience
* **Package Manager:** Both `package-lock.json` and `pnpm-lock.yaml` exist. Pick one (npm or pnpm) to avoid lock-file drift.
* **ESLint / Prettier:** Not set up yet—adding them will standardize code style and catch errors early.
* **Testing:** Consider Jest + React Testing Library for component tests.
* **CI/CD:** A simple GitHub Actions workflow can lint, test, and build on every push.

---

## 🔑 Environment Variables
Vite exposes variables prefixed with `VITE_` by default, but this project uses `loadEnv` manually to map `GEMINI_API_KEY`:

```
process.env.GEMINI_API_KEY
```

Create a `.env` file (not committed) with:
```
GEMINI_API_KEY=your-key-here
```

---

## 🚀 Getting Started
1. **Install dependencies** (choose _one_):
   ```bash
   # npm
   npm install
   # or pnpm
   pnpm install
   ```
2. **Start dev server**:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` (default) and start hacking!

---

## 🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

> _Happy coding!_ 