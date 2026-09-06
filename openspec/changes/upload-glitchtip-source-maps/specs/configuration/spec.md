## ADDED Requirements

### Requirement: Build-time-only credentials are not application configuration

A credential consumed solely by the build toolchain — not read by the running application on either side — SHALL form a third tier alongside public and server-secret variables. It SHALL NOT carry the `VITE_` prefix, SHALL NOT be declared in the application's env schemas, SHALL NOT be required or validated by server startup, and SHALL NOT be present in the running container's environment. Classification SHALL follow which process reads the value, not merely whether it is sensitive.

#### Scenario: Runtime does not require the build credential

- **WHEN** the container is started with the source-map upload credential absent from its environment
- **THEN** the server starts normally and error reporting works, because nothing at run time reads that value

#### Scenario: Build credential is not declared in the env schemas

- **WHEN** the application's public and server env schemas are inspected
- **THEN** neither declares the upload credential, and adding it to the runtime environment changes nothing about validation

#### Scenario: Build credential never reaches an artifact

- **WHEN** the built client output, the built server output, and the published image's filesystem and layer history are searched for the credential's value
- **THEN** no match is found in any of them

### Requirement: A missing build-time credential degrades one feature, not the build

Absence of a build-time-only credential SHALL disable exactly the build step that consumes it and SHALL NOT fail the build or alter the application's own behavior. A deployment context that requires the step SHALL assert the credential's presence itself, at the point where the requirement is real.

#### Scenario: Local build without the credential

- **WHEN** a developer runs a production build on a machine with no upload credential set
- **THEN** the build completes and produces a runnable application, with only the upload step skipped

#### Scenario: Deployment context asserts what it needs

- **WHEN** the container image is built without the upload credential supplied
- **THEN** the image build fails with a message naming the missing credential, even though the underlying application build alone would have succeeded

### Requirement: The variable template distinguishes build-time from run-time entries

The committed value-free template SHALL list every variable the project requires and SHALL state, for each, whether it is read at build time, at run time, or both. A build-time-only credential SHALL be marked as such so that no operator adds it to the running container.

#### Scenario: Operator reads the template

- **WHEN** an operator preparing a deploy reads the committed template
- **THEN** they can tell, without reading the Dockerfile or any source file, which values belong in the build invocation and which belong in the container environment

#### Scenario: Build-time credential is not copied into the runtime environment

- **WHEN** an operator populates the container environment from the template's run-time entries
- **THEN** the upload credential is not among them
