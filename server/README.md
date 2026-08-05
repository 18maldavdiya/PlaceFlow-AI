# PlaceFlow AI — Server

Node.js + Express API for PlaceFlow AI. Independent application — own `package.json`, own deployment (Render), the sole owner of the MongoDB Atlas connection. The client never talks to the database directly.

## Stack

Node.js · Express · MongoDB Atlas · Mongoose · JWT (access + refresh) via HTTP-only cookies · Socket.io · Cloudinary · Nodemailer

## Getting started

```bash
npm install
cp .env.example .env   # fill in MONGODB_URI, JWT secrets, etc.
npm run dev
```

Runs at `http://localhost:5000`. Confirm it's healthy:

```bash
curl http://localhost:5000/health
```

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start with nodemon (auto-restart on change) |
| `npm start` | Start once, production-style |
| `npm run lint` / `lint:fix` | ESLint (flat config) |
| `npm run format` / `format:check` | Prettier |

## Folder structure

```
server.js            Entry point: loads env, connects MongoDB, starts the HTTP + Socket.io server
src/
├── app.js             Express app: middleware pipeline, routes, error handlers — exported, not started here
├── config/            Environment loader, DB connection, CORS options
├── controllers/       Request handlers (thin — validate input, call a service, shape the response)
├── routes/            Express routers, one file per resource, aggregated in routes/index.js
├── models/            Mongoose schemas/models (empty until the first data model is designed)
├── middlewares/        Error handling, security headers, rate limiting, auth guards
├── services/           Business logic, independent of Express req/res (Clean Architecture's application layer)
├── repositories/       Data-access layer wrapping Mongoose models — services depend on repository interfaces, not on Mongoose directly
├── validators/         Request-payload validation schemas
├── utils/              ApiError, ApiResponse, asyncHandler, logger — cross-cutting helpers
├── lib/                Third-party client setup (Cloudinary, Nodemailer transporter)
├── jobs/               Scheduled/background jobs (cron, queue consumers)
├── emails/              Email templates and senders, built on lib's Nodemailer transporter
├── socket/              Socket.io server initialization and connection handling
└── uploads/             Local scratch space for file uploads in transit to Cloudinary (gitignored)
```

This mirrors the Clean Architecture layering from the Phase 1 blueprint: `controllers` → `services` → `repositories` → `models`, with `middlewares`, `utils`, and `lib` as cross-cutting infrastructure that every layer may use but that never depends back on `controllers` or `routes`.

## Environment variables

See `.env.example` for the full list and inline comments. `src/config/env.js` is the only module that reads `process.env` directly — everything else imports the parsed config from there.

## Security & cross-cutting middleware

Configured in `src/app.js`, in this order: `helmet` (security headers) → `cors` (origin allowlist from `CLIENT_ORIGINS`) → `express.json`/`cookie-parser` → `compression` → `morgan` (HTTP request logging, routed through the Winston logger) → rate limiting → routes → 404 handler → global error handler. See `src/middlewares/`.

## Health check

`GET /health` (unversioned, for infra/uptime checks) and `GET /api/v1/health` (versioned, what the client calls through its Axios instance) both return service status, uptime, and MongoDB connection state. This is the only route implemented at this stage — everything else is deliberately unbuilt until the next phase.

## Realtime, media, and email

- **Socket.io** (`src/socket/index.js`) is initialized against the same HTTP server as Express in `server.js`. No business events are registered yet — only connection/disconnection logging.
- **Cloudinary** (`src/lib/cloudinary.js`) is configured from environment variables; no upload routes exist yet.
- **Nodemailer** (`src/lib/mailer.js`) creates a reusable SMTP transporter; `src/emails/` is where templates and send functions will live once transactional emails are built.

## Deployment

Deployed on **Render** as a Node web service, building from `server/` with `npm install` and started with `npm start`. Environment variables are configured in the Render dashboard, mirroring `.env.example`. `GET /health` is registered as Render's health check path.
