# components/ui

Small, stateless, style-only UI atoms (badges, dividers, tags, skeletons) that are too
minor to belong in `components/common` but are still reused across more than one
feature. Nothing here should import from `features/`, `services/`, or `store/` —
these components take props and render, nothing else.

Empty at this stage of the project (initialization only) — populated as the first
features that need these atoms are built.
