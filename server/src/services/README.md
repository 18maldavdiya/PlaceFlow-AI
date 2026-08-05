# services

The application layer — business logic and use cases, independent of Express. Empty
at this stage since no features have been built yet.

## Conventions to follow once services are added

- One file per use-case area, named `<area>.service.js`, exporting plain async
  functions that controllers call.
- A service function never touches `req`/`res` — it receives plain arguments and
  returns plain data or throws an `ApiError`. This is what keeps business logic
  reusable from a future job (`jobs/`) or a socket handler (`socket/`), not just from
  an HTTP controller.
- A service talks to persistence only through `repositories/`, never through a
  Mongoose model directly.
- Cross-cutting rules from the Phase 1 blueprint's Business Rules section (eligibility
  gating, offer-policy enforcement, tenant isolation) are implemented here, not
  duplicated per controller.
