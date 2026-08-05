# PlaceFlow AI — Client

React 19 + Vite frontend for PlaceFlow AI. Independent application — own `package.json`, own deployment (Vercel), talks to the server only through the versioned REST API and a Socket.io connection.

## Stack

React 19 · Vite · Tailwind CSS · React Router · Redux Toolkit · TanStack Query · Axios · React Hook Form · Zod · Framer Motion · React Hot Toast · Lucide React

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

Runs at `http://localhost:5173`. API calls to `/api/*` and the `/socket.io` websocket are proxied to the server target configured by `VITE_API_PROXY_TARGET` (see `vite.config.js`) during development.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-free production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` / `lint:fix` | ESLint (flat config) |
| `npm run format` / `format:check` | Prettier, with Tailwind class sorting |

## Folder structure

```
src/
├── assets/       Static images, icons, fonts imported by components
├── components/   Reusable, presentation-only UI building blocks
│   ├── common/   Cross-cutting primitives (buttons, inputs, cards, feedback)
│   └── ui/       Small stateless UI atoms
├── features/     Feature-based modules (state, components, logic per domain feature)
├── layouts/      Page shells (header/footer/nav wrapping routed content)
├── pages/        Route-level components composed from features/components
├── routes/       Router configuration and route guards
├── hooks/        Reusable custom hooks
├── context/      React Context providers (e.g. theme)
├── services/     API clients — Axios instance and endpoint modules
├── store/        Redux Toolkit store and slices
├── styles/       Global CSS partials imported by index.css
├── utils/        Pure helper functions
├── constants/    App-wide constant values
├── config/       Runtime configuration (env var access)
├── lib/          Third-party client setup (React Query client, Socket.io client)
├── App.jsx       Root component: providers + router outlet
├── main.jsx      Application entry point
└── index.css     Tailwind entry + global styles
```

This structure follows **feature-based architecture**: as business features are added, each one gets its own folder under `features/` containing its own components, hooks, and Redux slice — `components/`, `hooks/`, and `store/` at the top level stay reserved for genuinely cross-cutting, feature-agnostic code.

## Path aliases

`@/` resolves to `src/` (configured in both `vite.config.js` and `jsconfig.json`), e.g. `import { api } from "@/services/api"`.

## Environment variables

See `.env.example` for the full list. Every variable read by browser code must be prefixed `VITE_` — anything without that prefix is invisible to the client bundle by Vite's design, which is deliberate: it's the enforced boundary against ever leaking a server secret into the frontend.

## State & data-fetching conventions

- **Redux Toolkit** (`src/store`) owns *client/UI state* — auth session shape, theme, global UI flags.
- **TanStack Query** (`src/lib/queryClient.js`) owns *server state* — anything fetched from the API is cached, revalidated, and mutated through it rather than mirrored into Redux.
- **React Hook Form + Zod** is the standard for every form: Zod schemas define validation, `@hookform/resolvers` wires them into React Hook Form.

## Deployment

Deployed on **Vercel**, building from `client/` as the project root with `npm run build` and output directory `dist`. Environment variables are configured per-environment in the Vercel dashboard, mirroring `.env.example`.
