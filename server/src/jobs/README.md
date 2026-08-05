# jobs

Scheduled and background work — cron-style tasks (e.g. expiring stale drive
registrations) and queue consumers (e.g. processing a batch notification send).
Empty at this stage.

## Conventions to follow once jobs are added

- One file per job, named `<job>.job.js`, exporting a single function containing the
  job's logic — the actual scheduling (cron expression, queue binding) is registered
  in a single `jobs/index.js` entry point, imported once from `server.js`, so every
  scheduled task is discoverable from one place.
- A job calls into `services/`, the same as a controller would — it never contains
  business logic itself, only orchestration (when to run, what to do with failures).
- Every job run is logged (start, success/failure, duration) through the shared
  `utils/logger.js`.
