## Why

The site needs GrowthBook feature flags and experiments without showing a default variant before the assigned variant. Experiment exposures must reach OpenPanel under the same visitor identity as existing analytics so subsequent actions can be analyzed by variant.

## What Changes

- Load the GrowthBook feature payload in the root loader and synchronously initialize a shared React provider for matching SSR and hydration. Nested components consume standard `useFeatureValue` / `useFeatureIsOn` hooks without per-feature loader plumbing.
- Reuse the existing visitor fingerprint for GrowthBook assignment and OpenPanel attribution.
- Disable browser streaming and automatic feature fetching initially; evaluate from the server-provided payload.
- Forward experiment and variation identifiers to OpenPanel when the corresponding page commits in the browser, excluding speculative loader requests.
- Add validated GrowthBook SDK connection configuration, bounded initialization, cached definitions, and explicit fallback values.
- Document how a future route consumes an experiment; verify the integration with controlled fixtures without launching a production experiment.

## Capabilities

### New Capabilities

- `experimentation`: Hybrid SSR and nested component hooks, hydration consistency, assignment identity, and experiment exposure events in OpenPanel.

### Modified Capabilities

None. New configuration follows the existing configuration contract.

## Impact

- Add compatible `@growthbook/growthbook` and `@growthbook/growthbook-react` packages using Bun; reuse installed OpenPanel packages and React Router loaders.
- Touch server payload loading, identity middleware integration, the root loader and React provider, the OpenPanel event bridge, and environment schemas/template/documentation during implementation.
- No database, additional identity cookie, browser GrowthBook fetch, visual-editor integration, production experiment, dashboard provisioning, or deployment is included.
- The configured SDK connection’s feature definitions and targeting rules are delivered to the browser; management credentials remain server-side and are not required by the app.
- Existing fingerprints change when IP/user agent changes; assignment stability is limited to an unchanged fingerprint and experiment configuration.
