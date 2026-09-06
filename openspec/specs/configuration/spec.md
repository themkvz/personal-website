## Purpose

Defines how the application declares, validates, and partitions environment variables between the server and the browser: which values are allowed to reach the client bundle, how a misconfiguration is surfaced, and what must never appear in a log line or in a shipped asset.

## Requirements

### Requirement: Two-tier variable classification

Every environment variable the application reads SHALL be classified as either **public** or **secret**, and the classification SHALL be expressed by the variable's name. A public variable's name SHALL carry the `VITE_` prefix; a secret's name SHALL NOT. Public variables MAY be read by both server and browser code; secrets SHALL be readable only by server code.

#### Scenario: Secret declared with a public name
- **WHEN** a variable whose name begins with `VITE_` is declared as a server-only secret
- **THEN** the type check fails with an error naming that variable, before any build or deploy can occur

#### Scenario: Public variable read from both sides
- **WHEN** a variable named with the `VITE_` prefix is declared once
- **THEN** both server code and browser code can read it without a second, divergent declaration of the same variable

### Requirement: The client bundle contains only declared public variables

The browser bundle SHALL contain the values of exactly those public variables the application declares. A variable present in the build environment but not declared SHALL NOT appear in any client asset, regardless of its name or prefix.

#### Scenario: Undeclared prefixed variable is not shipped
- **WHEN** the build runs with an additional `VITE_`-prefixed variable set in the environment that no schema declares
- **THEN** neither its name nor its value appears anywhere under the built client output

#### Scenario: Secret is absent from client output
- **WHEN** the built client output is searched for the value of any secret variable
- **THEN** no match is found, and the build fails if one is

### Requirement: Fail fast on invalid configuration

The server process SHALL validate its full environment during startup, before accepting any request, and SHALL exit rather than run in a degraded state when validation fails. The failure output SHALL name every variable that failed.

#### Scenario: Missing secret at startup
- **WHEN** the server is started without a required secret set
- **THEN** the process exits with a non-zero status and the output names the missing variable

#### Scenario: Startup is not deferred to first request
- **WHEN** the server is started with an invalid environment
- **THEN** it fails during startup, not on the first incoming request

### Requirement: Validation errors never disclose values

Environment validation failure output SHALL identify failing variables by name only. The offending value SHALL NOT appear in any error message, stack trace, or log line the process emits, on the server or in the browser console.

#### Scenario: Secret fails a format constraint
- **WHEN** a secret variable is set to a value that violates its declared constraint
- **THEN** the error output names the variable and the nature of the violation, and contains no substring of the supplied value

### Requirement: Committed record of the variable contract

The repository SHALL contain a committed, value-free template listing every environment variable the application requires, and that template SHALL be the reference the deployment documentation points at. The template SHALL carry no real values, and a populated local environment file SHALL remain untracked.

#### Scenario: New contributor sets up the project
- **WHEN** a contributor copies the committed template to a local environment file and fills in values
- **THEN** both the dev server and a production build start successfully with no further variables needed

#### Scenario: Template contains no secrets
- **WHEN** the committed template is inspected
- **THEN** every entry has an empty or placeholder value, and no real credential is present

#### Scenario: Declared variable missing from the template
- **WHEN** the application declares a required variable that the template does not list
- **THEN** this is a defect in the template, and the template is the artifact corrected

### Requirement: Derived values are not declared as variables

A value that can be computed from an already-declared variable SHALL NOT be declared as a second environment variable. The application SHALL derive it at the point of use. Declaring both invites the two to diverge, and a deploy in which they disagree fails silently rather than loudly.

#### Scenario: Reporting endpoint alongside an ingest endpoint

- **WHEN** a component needs a reporting endpoint whose host, project identifier, and key are all present in an already-declared ingest endpoint
- **THEN** the reporting endpoint is derived from that variable, and the committed template lists only the one variable

#### Scenario: Derivation cannot be performed

- **WHEN** a declared variable's value does not contain the parts a derived value needs
- **THEN** validation fails at startup, naming the variable, and the failure output contains no substring of the value

### Requirement: Public identifiers of third-party services are declared public

An identifier that a third-party service intends to be visible to the browser — one that appears in page markup, in a response header, or in a request the browser itself makes — SHALL be classified public and carry the `VITE_` prefix, even when only server code reads it today. Classification SHALL follow the value's actual exposure, not its current call sites.

#### Scenario: Ingest endpoint containing a public key

- **WHEN** an error-tracking ingest endpoint whose embedded key is designed to be shipped to browsers is declared
- **THEN** it is declared as a public `VITE_`-prefixed variable, and no attempt is made to keep its value out of the client bundle

#### Scenario: Server-only credential

- **WHEN** a credential that grants write access beyond event ingestion is needed
- **THEN** it is declared without the `VITE_` prefix and remains readable only by server code
