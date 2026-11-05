# React diagnostics

```bash
bun run doctor
```

[`doctor.config.json`](../doctor.config.json) configures a full-project scan with detailed findings and a nonzero exit when errors are reported. Warnings remain visible. The command uses the installed React Doctor version; CLI flags override configuration values.

For local diagnostics without the score API, share URL, crash reporting, or dependency supply-chain checks:

```bash
bun run doctor -- --no-score --no-supply-chain --yes
```

This has reduced coverage: it omits the dependency supply-chain checks and scoring.

## History

Baseline on 2026-09-06 with React Doctor 0.9.13: the local diagnostic command scanned 82 files and reported 3 errors and 14 warnings, exiting 1. These findings are unvalidated and deferred for separate investigation; configuration does not suppress them or require a clean score.
