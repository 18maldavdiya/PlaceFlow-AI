# Docs

Planning and architecture records for PlaceFlow AI. Anything that changes how the system is designed — not how a specific feature is coded — belongs here, not in code comments.

## Contents

- **Phase 1 Blueprint** — the full planning document (problem statement, personas, roles, requirements, roadmap, architecture, Project Memory). Published as a shareable artifact; a static copy should be added to this folder (e.g. `phase-1-blueprint.md`) as the durable, version-controlled reference once Phase 1 sign-off is final.
- **Architecture Decision Records (ADRs)** — as the codebase grows, record non-obvious technical decisions here as `adr-XXXX-title.md`, one file per decision, following the standard "Context / Decision / Consequences" format referenced in the root README's development standards.

## Locked decisions this codebase must not deviate from

These were established during planning and are treated as constraints, not suggestions, for every subsequent build phase:

1. **Stack**: React 19 + Vite + Tailwind CSS + React Router + Redux Toolkit + Axios + React Hook Form + Zod + Framer Motion on the client; Node.js + Express on the server. No alternative frameworks.
2. **Database**: MongoDB Atlas via Mongoose only. No relational database (PostgreSQL, MySQL) or alternative backend-as-a-service (Supabase, Firebase) is to be introduced without an explicit, separate decision.
3. **Auth**: JWT access + refresh tokens delivered via HTTP-only cookies — not local storage token handling.
4. **Architecture style**: Clean Architecture layering with a feature-based folder structure, SOLID principles, and a modular monolith with a clear extraction path to services.
5. **Roles**: Super Admin, College Admin, TPO, Student, Recruiter, HR, Interviewer, Alumni — enforced server-side.

Any future planning session or contributor should treat this list as the current source of truth alongside the full blueprint.
