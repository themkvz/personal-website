## ADDED Requirements

### Requirement: Repository-authored feature definitions and validation

Feature flags, experiment variations, targeting attributes, and evaluation test specs SHALL be authored in the repository and compiled into a static JSON datafile before the application builds or runs. The repository SHALL provide validation commands that lint definitions and run test specs offline. No external feature-flag service, API host, or client key SHALL be required, and the browser SHALL make no network request for feature definitions.

#### Scenario: Definitions validate and compile offline
- **WHEN** the feature validation and datafile build commands run in an environment without external network access
- **THEN** attribute, feature, and test definitions are linted, all declarative test specs pass, and a deterministic JSON datafile is produced

#### Scenario: Invalid definition or failing test spec
- **WHEN** a feature definition violates schema constraints or a declarative test assertion fails
- **THEN** the validation command exits with a non-zero status and identifies the offending feature or test spec

#### Scenario: Zero external connection configuration
- **WHEN** the application starts or builds with no feature-flag environment variables set
- **THEN** server rendering and browser hydration evaluate features directly from the compiled datafile without warning or error

#### Scenario: No browser feature network traffic
- **WHEN** an experiment page and its network activity are inspected
- **THEN** the browser evaluates the compiled datafile locally and neither fetches nor streams from any external feature-flag host

### Requirement: Safe fallback and analytics resilience

Feature evaluation SHALL execute synchronously in memory from the compiled datafile and fall back to explicit safe default values when a feature is disabled, unallocated, or absent from the datafile. Analytics failures MUST NOT prevent rendering or navigation and MUST NOT cause unhandled rejections.

#### Scenario: Disabled or unallocated feature
- **WHEN** a consumed feature is disabled, unallocated for the visitor's bucket, or absent from the datafile
- **THEN** SSR and hydration display the explicit fallback value and no experiment exposure event is emitted

#### Scenario: Invalid or unexpected value
- **WHEN** a feature evaluation yields a nullish or unmapped value for the consumer's contract
- **THEN** the consumer renders its safe fallback and does not claim exposure to a rejected variation

#### Scenario: Analytics unavailable
- **WHEN** OpenPanel is blocked or event submission rejects
- **THEN** experiment content and navigation continue normally without an unhandled rejection; delivery is best effort

## MODIFIED Requirements

### Requirement: Consistent rendered variants

The application SHALL supply a shared feature-definition snapshot and targeting attributes for evaluation during server rendering and browser hydration. Nested components SHALL consume feature values directly without per-feature loader results or values passed through intermediate components. The initial HTML and hydrated UI MUST use the same resolved value without hiding content or swapping a fallback for a fetched variant after hydration. Client navigation SHALL evaluate destination content synchronously using the current feature snapshot and visitor targeting context.

#### Scenario: Assigned variant on first visit
- **WHEN** a visitor receives a non-default variant
- **THEN** that variant is present in the server HTML and remains identical during hydration, including on a slow connection or with JavaScript disabled

#### Scenario: Client navigation
- **WHEN** a visitor navigates to a page consuming an experiment
- **THEN** the destination first displays its resolved variant without an intermediate destination fallback

#### Scenario: Definitions change after response
- **WHEN** feature definitions update in a new build after the server has returned a page's feature snapshot
- **THEN** the mounted document snapshot remains unchanged through hydration, ordinary rerenders, and client navigation until a full reload loads the new bundle

#### Scenario: Deeply nested consumer
- **WHEN** a component several levels below the page consumes a feature
- **THEN** it reads the shared feature context directly without intermediate components forwarding flag values, and produces the same initial value during SSR and hydration

#### Scenario: Client-only mount
- **WHEN** an interaction mounts a new feature-consuming component after hydration
- **THEN** it evaluates synchronously from the in-memory datafile instance without a network request

### Requirement: Shared assignment identity and isolation

Feature and experiment assignment SHALL use the same visitor fingerprint as OpenPanel attribution. Unchanged identity, targeting attributes, and experiment configuration SHALL yield the same assignment. Concurrent visitors' attributes and assignments MUST remain isolated, including through shared HTTP caches.

#### Scenario: Repeat visit
- **WHEN** a visitor returns with an unchanged fingerprint, targeting attributes, and experiment configuration
- **THEN** the assignment is unchanged and events use the same OpenPanel profile ID

#### Scenario: Concurrent visitors
- **WHEN** two different fingerprints request experiment content concurrently
- **THEN** each receives their own targeting identity, rendered assignments, and exposure attribution; shared feature definitions do not share visitor state, and personalized responses cannot be reused by a shared cache for another visitor

## REMOVED Requirements

### Requirement: Bounded fallback and recovery

**Reason**: Feature definitions are compiled into a static repository datafile rather than fetched over the network from GrowthBook with a 1,000 ms timeout and background refresh. Replaced by `Safe fallback and analytics resilience`.
**Migration**: Evaluate features synchronously from the bundled datafile and rely on `Safe fallback and analytics resilience` for disabled, unallocated, or invalid feature values and best-effort analytics delivery.

### Requirement: Explicit connection configuration

**Reason**: Featurevisor definitions live in the repository and compile into a local datafile, eliminating the external GrowthBook service and its `GROWTHBOOK_API_HOST` / `GROWTHBOOK_CLIENT_KEY` connection pair.
**Migration**: Remove `GROWTHBOOK_API_HOST` and `GROWTHBOOK_CLIENT_KEY` from environment schemas, `.env.example`, and deployment environments; author and build feature definitions via Featurevisor in the repository.
