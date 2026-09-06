## ADDED Requirements

### Requirement: A maintainer can manually resolve stack traces to original source

A maintainer SHALL be able to produce a build with source maps, inject debug IDs into it, and upload it to the error-tracking backend using their own locally configured credentials, so that events captured against that build's debug IDs resolve to original source (file, line, column, function) instead of the bundled artifact. This workflow SHALL be manual and out of band: it SHALL NOT run automatically as part of any build or deploy step, and SHALL NOT introduce any credential read by the running application.

#### Scenario: Building with source maps

- **WHEN** a maintainer runs the source-map build variant instead of the normal production build
- **THEN** `.map` files are emitted alongside the build output, in addition to the files the normal build already produces

#### Scenario: Injecting and uploading

- **WHEN** a maintainer runs the error-tracking backend's CLI to inject debug IDs into that build output, then upload it with their own auth token, organization, project, and a release identifier
- **THEN** the CLI reports the files uploaded, and subsequent events captured against that build's debug IDs resolve to original source in the error-tracking project

#### Scenario: Normal build stays free of source maps

- **WHEN** the normal production build (the one used for deploys) runs, with no source-map flag set
- **THEN** no `.map` file is produced, no served client asset carries a `sourceMappingURL` comment, and nothing about the build depends on the error-tracking backend being reachable

#### Scenario: No new runtime credential

- **WHEN** the application's public and server env schemas, and the running container's environment, are inspected
- **THEN** none of them contain an error-tracking upload credential — the CLI reads its own locally stored login/config, never something the application passes to it

### Requirement: Shared reporting options are declared once

Configuration that is genuinely common to the browser and server reporters — the trace sample rate, and the suppression of session envelopes the backend does not implement — SHALL be expressed in one place shared by both. Values that legitimately differ between the two sides SHALL remain explicit at each side rather than being folded into the shared declaration.

#### Scenario: Sample rate is changed

- **WHEN** the trace sample rate is changed
- **THEN** one value is edited and both the browser and server reporters follow it, with no second value able to drift

#### Scenario: Shared declaration stays client-safe

- **WHEN** the client bundle is built
- **THEN** the shared declaration introduces no server-only module, secret, or Node built-in into that bundle
