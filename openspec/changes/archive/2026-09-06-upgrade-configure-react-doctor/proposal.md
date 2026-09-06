## Why

React Doctor is installed and exposed through `bun run doctor`, but its scan policy is implicit and the README does not document the workflow. The previous dependency upgrade already installed 0.9.13, which npm reports as latest on 2026-09-06; configuration and verification remain.

## What Changes

- Check the stable release at implementation time; retain 0.9.13 if still current, otherwise update only React Doctor and its required dependency graph with Bun after checking compatibility.
- Add a root `doctor.config.json` declaring full-project scans, verbose diagnostics, and failure on errors, with upstream rules retained.
- Document normal scans, a local diagnostic scan without score/supply-chain network calls, exit behavior, and the existing findings in README.md.
- Keep existing findings visible. Any future suppression requires inspection of the relevant code and a narrowly documented justification.

## Capabilities

### New Capabilities

None. Tooling-only change; `skip_specs: true` is set.

### Modified Capabilities

None. Application behavior and existing specification requirements remain unchanged.

## Impact

- Add `doctor.config.json`; update README.md.
- Change package.json and bun.lock only if a newer compatible release is available.
- Preserve the existing `doctor` script and Biome workflow.
- No CI installation, hooks, agent-skill installation, runtime profiling, application fixes, or score target.
- Baseline: the installed CLI scanned 82 files and reported 17 findings (3 errors, 14 warnings), exiting 1, with score and supply-chain checks disabled for this diagnostic run. These findings have not been adjudicated.
