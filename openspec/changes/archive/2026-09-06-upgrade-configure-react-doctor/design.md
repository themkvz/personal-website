## Context

See proposal.md for motivation and scope. package.json, bun.lock, and the installed CLI agree on React Doctor 0.9.13. The current `doctor` script is `react-doctor .`. There is no existing Doctor configuration or GitHub Actions workflow. The actual dependencies use React Router 8.3.1 and React 19.2.8 despite older version labels in project documentation.

The local baseline command was `bun run doctor -- --no-score --no-supply-chain --verbose --yes`. It scanned 82 files, reported 3 errors and 14 warnings, and exited 1. Findings include state/effect diagnostics in identity components, accessibility diagnostics, JSON-in-HTML reporting, and an index-key warning in a vendored primitive. These are scanner reports, not validated bugs.

## Goals / Non-Goals

**Goals:** Make scan coverage, detail, and failure policy reviewable in one configuration file; verify that the installed release honors it.

**Non-Goals:** No score threshold, suppression baseline, custom rules, application changes, or new automation. Do not import Biome exclusions into Doctor automatically or exclude vendored UI as a blanket policy.

## Decisions

1. **Retain the current version when latest.** `npm view react-doctor version engines --json` returned 0.9.13 and Node `^20.19.0 || >=22.13.0` on 2026-09-06. Recheck during apply; use Bun for a necessary upgrade and lockfile changes. Do not downgrade or manufacture a version bump. Running an unpinned remote CLI instead would make the existing script less reproducible.

2. **Use `doctor.config.json`.** Add the upstream schema URL and only `scope: "full"`, `verbose: true`, and `blocking: "error"`. JSON fits existing configuration and avoids executable configuration. Keep `doctor` unchanged. Package-level configuration would save a file but make the scan policy less visible and lose standalone schema assistance. Do not add empty ignore arrays or repeat other defaults.

3. **Keep error exits and upstream rules.** Existing errors are allowed to keep the command nonzero; configuring the tool is not a promise to eliminate its backlog. An advisory gate or blanket suppressions would obscure existing diagnostics. CLI overrides remain available for explicit one-off investigations.

4. **Document the optional network-independent diagnostic invocation.** Keep normal network behavior unchanged. The documented local alternative is `bun run doctor -- --no-score --no-supply-chain --yes`; it omits scoring and dependency supply-chain checks and must not be described as equivalent coverage. No persistent telemetry preference or security-check setting is changed.

Upstream references: [configuration](https://www.react.doctor/docs/configuration/config-files) documents JSON configuration, CLI precedence, scope and blocking; [repository README](https://github.com/millionco/react-doctor) describes the separate CI, agent-installation, and profiling workflows. Installed `--help` confirms the diagnostic flags above. These surfaces were checked during planning; recheck if upgrading.

## Risks / Trade-offs

- Existing findings keep error exits → Document the observed exit code and report rather than disabling rules to make verification green.
- Future releases can change rules and options → Compare the selected release's help/configuration and record scan changes before accepting an upgrade.
- Scoring and supply-chain services can be unavailable → Verify local configuration with the diagnostic invocation, then report normal-run network failures separately.
- Counts depend on source changes and scanner version → Record counts as dated observations, not acceptance thresholds.

## Migration Plan

Add configuration and documentation, update the dependency only if needed, then run the scans and targeted checks in tasks.md. No deployment or data migration is required. Rollback consists of reverting these file changes and using Bun to restore the prior dependency resolution if it changed.
