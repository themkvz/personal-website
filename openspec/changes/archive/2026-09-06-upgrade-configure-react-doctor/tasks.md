## 1. Verify the release

- [x] 1.1 Check `npm view react-doctor version engines --json`, the installed version, and supported CLI flags. If still current, retain 0.9.13 and record that no upgrade is needed; otherwise use `bun add -d react-doctor@<verified-version>` after reviewing compatibility. Verify package.json, bun.lock, and `bun run doctor -- --version` agree, with no unrelated dependency upgrades.

## 2. Configure and document

- [x] 2.1 Add doctor.config.json with `$schema: "https://react.doctor/schema/config.json"`, `scope: "full"`, `verbose: true`, and `blocking: "error"`. Keep the existing script and default rules. Verify `bun run doctor -- --no-score --no-supply-chain --yes` loads the configuration without errors and emits detailed full-project findings; record diagnostic counts and process exit status without treating existing reported errors as configuration failures.
- [x] 2.2 Add a README diagnostics section covering `bun run doctor`, the optional `--no-score --no-supply-chain --yes` invocation and its reduced coverage, configuration location, error exits, and the dated baseline observed during implementation. Verify documented commands against the installed help and scan output; describe findings as unvalidated and deferred, without adding suppressions or application fixes.

## 3. Verify integration

- [x] 3.1 Run the normal `bun run doctor` and record findings, exit status, and any network/service failures separately. Compare against the local diagnostic scan, accounting for the additional supply-chain coverage. Verify a one-off local scan with `--blocking none` preserves findings while allowing an advisory exit; do not persist this override.
- [x] 3.2 Run `bun run lint` and `bun run typecheck`; report pre-existing failures separately. Inspect the final diff to verify only configuration, README, and any necessary React Doctor dependency changes are present. No runtime build or new test framework is required for configuration-only changes.

## Verification record (2026-09-06)

- Registry latest, lockfile, and installed CLI: 0.9.13; no dependency changes required.
- Configured local scan: 82 files, 3 errors and 14 warnings, exit 1; detailed output confirms verbose configuration is applied.
- Local advisory override: same 17 findings, exit 0; override was not persisted.
- Normal scan: same 17 findings, exit 1. Score API unavailable in the sandbox and still reported unavailable after an escalated retry. No additional supply-chain findings or explicit supply-chain failure appeared; successful remote dependency coverage was not independently established.
- `bun run lint`: exit 0, one existing broken-symlink warning at `.claude/skills/open-pencil`; no fixes applied.
- `bun run typecheck`: exit 0. `git diff --check`: clean.
- Final implementation scope: doctor.config.json and README.md only; remaining changes are these OpenSpec artifacts. Application code, dependency files, and scripts are unchanged.
