## Purpose

Provide component-level feature evaluation with consistent server rendering and hydration without client-side flicker and record attributable experiment exposures in OpenPanel for analysis alongside visitor actions.

## ADDED Requirements

### Requirement: Consistent rendered variants

The application SHALL supply a shared feature-definition snapshot and targeting attributes for evaluation during server rendering and browser hydration. Nested components SHALL consume feature values directly without per-feature loader results or values passed through intermediate components. The initial HTML and hydrated UI MUST use the same resolved value without hiding content or swapping a fallback for a fetched variant after hydration. Client navigation SHALL evaluate destination content using the committed destination URL and current feature snapshot, adopting any new bootstrap snapshot atomically.

#### Scenario: Assigned variant on first visit
- **WHEN** a visitor receives a non-default variant
- **THEN** that variant is present in the server HTML and remains identical during hydration, including on a slow connection or with JavaScript disabled

#### Scenario: Client navigation
- **WHEN** a visitor navigates to a page consuming an experiment
- **THEN** the destination first displays its resolved variant without an intermediate destination fallback

#### Scenario: Definitions change after response
- **WHEN** GrowthBook definitions update after the server has returned a page’s feature snapshot
- **THEN** the snapshot remains unchanged through hydration and ordinary rerenders; a reload or committed root-loader revalidation can replace it, and client navigation can reevaluate URL targeting

#### Scenario: Deeply nested consumer
- **WHEN** a component several levels below the page consumes a feature
- **THEN** it reads the shared feature context directly without intermediate components forwarding flag values, and produces the same initial value during SSR and hydration

#### Scenario: Client-only mount
- **WHEN** an interaction mounts a new feature-consuming component after hydration
- **THEN** it evaluates synchronously from the current snapshot without a GrowthBook network request

### Requirement: Shared assignment identity and isolation

GrowthBook assignment SHALL use the same visitor fingerprint as OpenPanel attribution. Unchanged identity, targeting attributes, and experiment configuration SHALL yield the same assignment. Concurrent visitors' attributes and assignments MUST remain isolated, including through shared HTTP caches.

#### Scenario: Repeat visit
- **WHEN** a visitor returns with an unchanged fingerprint, targeting attributes, and experiment configuration
- **THEN** the assignment is unchanged and events use the same OpenPanel profile ID

#### Scenario: Concurrent visitors
- **WHEN** two different fingerprints request experiment content concurrently
- **THEN** each receives their own targeting identity, rendered assignments, and exposure attribution; shared feature definitions do not share visitor state, and personalized responses cannot be reused by a shared cache for another visitor

### Requirement: OpenPanel records consumed experiment variants

After experiment content commits in the browser, the application SHALL submit an `Experiment Viewed` event to OpenPanel under the assignment fingerprint. Properties SHALL include `feature_key`, `experiment_id`, numeric `variation_id`, and string `variation_key`. Both control and treatment participation SHALL be recorded. Arbitrary variant values and raw identity inputs MUST NOT be added as custom event properties.

#### Scenario: Treatment exposure followed by a click
- **WHEN** a visitor sees a treatment and then triggers an existing tracked action
- **THEN** OpenPanel receives the exposure with its experiment and variant identifiers under the same profile ID as that action

#### Scenario: Control exposure
- **WHEN** a visitor participates in the control variation
- **THEN** an exposure records the control identifiers rather than treating the control as an unassigned fallback

#### Scenario: Multiple experiments
- **WHEN** a page consumes two experiments
- **THEN** each receives its own event with the correct identifiers, without overwriting a single profile-level variant field

### Requirement: Exposures exclude speculative work and duplicate rendering

The application SHALL submit at most one exposure attempt per fingerprint, experiment ID, and variation ID within a browser document lifetime. Rerenders and client navigation SHALL share that deduplication scope; a full reload SHALL start a new scope. Evaluation without committed experiment content MUST NOT produce an exposure.

#### Scenario: Repeated effects
- **WHEN** development effect replay, rerenders, or client navigation consume the same assignment again
- **THEN** only one exposure attempt occurs within that document

#### Scenario: Prefetch or abandoned request
- **WHEN** a page is prefetched, a navigation is abandoned, or a HEAD request is served without the content committing in the browser
- **THEN** no exposure is sent for that work

#### Scenario: Abandoned component render
- **WHEN** an experiment hook evaluates in a subtree whose render is abandoned or remains suspended while other content commits
- **THEN** no exposure is sent for that subtree unless its experiment content later commits

#### Scenario: Nonparticipant or ordinary flag
- **WHEN** a visitor is outside the experiment or consumes a flag with no experiment participation
- **THEN** no experiment exposure is fabricated

### Requirement: Bounded fallback and recovery

Cold initialization SHALL wait no longer than 1,000 ms for GrowthBook before using explicit safe fallback values. Missing or invalid feature values SHALL also use their fallback. Cached usable definitions SHALL remain usable during refresh failure. Recovery SHALL apply to later server payload responses; an existing browser snapshot SHALL change only on reload or committed root-loader revalidation. Analytics failures MUST NOT prevent rendering or navigation and MUST NOT cause unhandled rejections.

#### Scenario: Cold outage
- **WHEN** GrowthBook is unavailable and no usable definitions are cached
- **THEN** initialization stops waiting within the bound, SSR and hydration display the same fallback, and no assigned-variant event is emitted

#### Scenario: Invalid remote value
- **WHEN** a feature value violates the consumer's expected value contract
- **THEN** the consumer renders its safe fallback and does not claim exposure to the rejected value

#### Scenario: Refresh and recovery
- **WHEN** a refresh fails and later succeeds
- **THEN** existing usable definitions support server payload responses during the outage and later loader responses can supply recovered definitions without mutating an existing browser snapshot

#### Scenario: Analytics unavailable
- **WHEN** OpenPanel is blocked or event submission rejects
- **THEN** experiment content and navigation continue normally without an unhandled rejection; delivery is best effort

### Requirement: Explicit connection configuration

The integration SHALL accept a public GrowthBook API host and SDK client key as a pair. With neither configured, consumers SHALL render fallbacks without GrowthBook network requests or exposure events. Partial configuration or a malformed HTTP(S) host SHALL fail environment validation with variable names only. Browser streaming and automatic GrowthBook fetching SHALL remain disabled. No GrowthBook management credential SHALL be required or exposed.

#### Scenario: Disabled integration
- **WHEN** both connection variables are absent
- **THEN** existing pages work and all experiment consumers receive their fallback values

#### Scenario: Invalid configuration
- **WHEN** only one connection variable is present or the host is malformed
- **THEN** validation fails before serving traffic and names the invalid variables without logging their values

#### Scenario: Browser payload
- **WHEN** an experiment page and its network activity are inspected
- **THEN** the browser receives the configured SDK connection’s feature definitions, targeting rules, and required visitor targeting attributes; it neither fetches nor streams from GrowthBook and receives no management credentials or decryption secrets
