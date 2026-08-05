# features

Feature-based modules. Each business capability (once built) gets its own folder
here, e.g.:

```
features/
└── drives/
    ├── components/     Feature-only components
    ├── hooks/          Feature-only hooks
    ├── api/             React Query hooks calling services/
    ├── driveSlice.js    Redux slice, if the feature needs client state
    └── index.js         Public exports — the only thing other code imports
```

A feature folder may depend on the top-level `components/`, `hooks/`, `services/`,
`store/`, `utils/`, `lib/`, and `constants/` — never the other way around, and never
directly on another feature's internals (go through its `index.js` if that's ever
needed).

Empty at this stage of the project (initialization only). This document exists so the
convention is established before the first feature is added, per the Phase 1
blueprint's feature-based architecture decision.
