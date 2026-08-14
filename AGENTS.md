# Agent Instructions

<!-- frog-friction-rules -->
## Friction logging

- Run `frog list` before guessing at a repository papercut that may already be known.
- Log recurring, actionable repository-specific friction in `.agents/friction-log/` with `frog log` as it is encountered.
- Put sanitized reproduction files in the entry's `artifacts/` directory when practical.
- Route cross-project, shared-tooling, and system-wide workflow friction to `~/GitHub/friction-log` instead of this repository.
- Never log secrets, credentials, personal data, client-confidential data, model-internal limitations, one-off command mistakes, or transient third-party outages.
<!-- /frog-friction-rules -->
