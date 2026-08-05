# validators

Request-payload validation schemas, one file per resource (e.g. `student.validator.js`),
applied as route-level middleware before a controller ever runs. Empty at this stage —
there are no request bodies to validate until the first API endpoint beyond the health
check is built.

## Conventions to follow once validators are added

- Each validator exports a schema plus a small `validate(schema)` middleware factory
  (kept in `middlewares/validate.js` once needed) that parses `req.body`/`req.query`/
  `req.params` and calls `next(ApiError.badRequest(...))` on failure — controllers
  never re-validate input that already passed through a validator.
- Validation happens at the edge (routes), before a controller or service sees the
  data, so services can assume their input is already well-formed.
