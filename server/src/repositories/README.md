# repositories

The data-access layer — the only place in the codebase allowed to import from
`models/` directly. Empty at this stage since there are no models yet.

## Why this layer exists

Clean Architecture's dependency-inversion rule: `services/` (business logic) should
depend on a repository's method signatures (`findById`, `create`, `softDelete`, ...),
never on Mongoose itself. That keeps the domain logic testable without a database and
means a persistence detail — an added index, a changed embed-vs-reference decision —
never has to ripple up into a controller.

## Conventions to follow once repositories are added

- One file per entity, named `<entity>.repository.js`, exporting plain functions (not
  a class) that wrap the corresponding Mongoose model.
- Every read defaults to excluding soft-deleted documents (`isDeleted: false`); an
  explicit `{ includeDeleted: true }` option is required to see them.
- Multi-document writes that must be atomic (e.g. accepting an offer touching the
  offer, the application, and an audit-log entry) open and pass a Mongoose session
  through the repository functions involved, committing the transaction at the
  service layer that orchestrates them.
- Repository functions return plain data (or throw `ApiError`), never a raw Mongoose
  document with its internal methods exposed to a controller.
