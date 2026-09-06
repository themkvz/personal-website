## ADDED Requirements

### Requirement: Reported stack traces resolve to original source

Every error event reaching the error-tracking backend from a production build SHALL carry frames that name the original source file, line, column, and function — for both browser and server code — not the bundled or minified artifact the runtime actually executed. Resolution SHALL be performed by the backend from build-time-supplied source maps, and SHALL NOT depend on the runtime serving, exposing, or shipping those source maps.

#### Scenario: Client error frame names its source file

- **WHEN** an unhandled error is thrown from a component in a production build and its event is inspected in the error-tracking project
- **THEN** the top frames name the authoring path under `src/` with the original line, column, and function name, not a hashed asset filename with a single-line offset

#### Scenario: Server error frame names its source file

- **WHEN** a loader throws in a production build and its event is inspected
- **THEN** the frames name the authoring path under `src/` rather than a line number in the single bundled server entry

#### Scenario: Frames resolve without a release identifier

- **WHEN** two deploys built from different commits both report errors
- **THEN** each event resolves against the source maps from its own build, with no release name, version string, or deploy identifier needing to be configured or kept in sync between build and runtime

#### Scenario: Source maps are not reachable from the browser

- **WHEN** the deployed site's client assets are requested, including any URL derived by appending `.map` to a served asset
- **THEN** no source map is returned, and no served asset carries a `sourceMappingURL` comment pointing at one

### Requirement: Source-map upload failure does not silently degrade reporting

The build SHALL make the state of source-map upload unambiguous. When upload is configured and fails, the build SHALL fail. When upload is deliberately not configured, the build SHALL succeed and SHALL say that stack traces from its output will be unresolved.

#### Scenario: Upload configured and the backend rejects it

- **WHEN** a build runs with upload credentials present and the backend rejects the upload or is unreachable
- **THEN** the build exits non-zero, rather than producing an image whose events would report unresolved frames

#### Scenario: Upload deliberately not configured

- **WHEN** a build runs with no upload credentials present, as in local development
- **THEN** the build succeeds, emits no source map into the served client output, and reports that source-map upload was skipped

### Requirement: Shared reporting options are declared once

Configuration that is genuinely common to the browser and server reporters — the trace sample rate, and the suppression of session envelopes the backend does not implement — SHALL be expressed in one place shared by both. Values that legitimately differ between the two sides SHALL remain explicit at each side rather than being folded into the shared declaration.

#### Scenario: Sample rate is changed

- **WHEN** the trace sample rate is changed
- **THEN** one value is edited and both the browser and server reporters follow it, with no second value able to drift

#### Scenario: Shared declaration stays client-safe

- **WHEN** the client bundle is built
- **THEN** the shared declaration introduces no server-only module, secret, or Node built-in into that bundle
