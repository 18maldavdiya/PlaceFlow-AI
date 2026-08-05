# models

Mongoose schemas and models — the persistence layer. Empty at this stage per the
project's instructions: no data models are defined until the dedicated schema-design
phase (see `docs/README.md`).

## Conventions to follow once models are added

- One file per collection, named `<entity>.model.js` (e.g. `student.model.js`),
  exporting the compiled model as the default export.
- Every schema includes the shared soft-delete fields — `isDeleted`, `deletedAt`,
  `deletedBy` — applied via a shared Mongoose plugin (`plugins/softDelete.js`) rather
  than repeated by hand in each schema.
- Every tenant-scoped schema includes a required, indexed `tenantId` field, and uses
  the shared tenant-scoping query plugin so reads/writes are structurally isolated per
  college.
- `timestamps: true` on every schema.
- Compound indexes are declared explicitly in the schema (`schema.index({...})`), not
  left implicit — see the Phase 1 blueprint's "MongoDB best practices applied" section
  for the indexing strategy this must follow.
- Controllers and services never import a model directly for writes that need to be
  transactional or auditable — they go through `repositories/`, which is what actually
  talks to Mongoose.
