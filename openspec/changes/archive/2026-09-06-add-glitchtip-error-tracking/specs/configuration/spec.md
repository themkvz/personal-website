## ADDED Requirements

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
