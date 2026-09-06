## ADDED Requirements

### Requirement: Source maps are uploaded during the image build

The image build SHALL upload source maps for both the client and server outputs to the error-tracking backend as part of producing the image, so that the artifact and the maps describing it are always produced together and cannot drift apart.

#### Scenario: Successful build uploads maps for both outputs

- **WHEN** the image is built with the upload credential and backend coordinates supplied
- **THEN** source maps covering both the client assets and the server bundle are uploaded before the build completes

#### Scenario: Build without the upload credential

- **WHEN** the image is built without the upload credential supplied
- **THEN** the build fails with a message naming the missing credential, consistent with how a missing required client build argument is handled

### Requirement: The upload credential is not exposed to the image

The upload credential SHALL be supplied to the build in a form that leaves no trace in the resulting image or its layer metadata. It SHALL NOT be passed as a build argument and SHALL NOT be written into any layer.

#### Scenario: Inspecting image history

- **WHEN** the built image's layer history and build-argument metadata are inspected
- **THEN** the credential's name may appear as a reference, but its value appears nowhere

#### Scenario: Searching the image filesystem

- **WHEN** the final image's filesystem is searched for the credential's value
- **THEN** no match is found

### Requirement: No source map is shipped or served

Neither the published image nor the served client output SHALL contain a source map. Source maps SHALL exist only inside the build, long enough to be uploaded, and SHALL be removed before the artifact is assembled.

#### Scenario: Image filesystem contains no source maps

- **WHEN** the final image's build output directory is listed recursively
- **THEN** it contains no `.map` file

#### Scenario: Served assets do not advertise source maps

- **WHEN** any served client asset is fetched
- **THEN** it carries no `sourceMappingURL` comment, and requesting the corresponding `.map` URL returns no source map

## MODIFIED Requirements

### Requirement: Documented deploy procedure

The repository README SHALL document the production deploy procedure: the build command with its required build arguments and any required build-time secrets, the run command with its required runtime environment variables, and which variables belong to which phase. Where a variable is required in both phases, the README SHALL say so. Where a value is required at build time and must never be set at run time, the README SHALL say that too.

#### Scenario: Following the README

- **WHEN** a reader follows the README Deployment section on a machine with Docker and no prior knowledge of the project
- **THEN** they can build and run the image without consulting the Dockerfile

#### Scenario: Variable required in both phases

- **WHEN** a reader looks up a `VITE_`-prefixed variable that the client bundle inlines at build time and server validation also requires at run time
- **THEN** the README shows it in both the build and run commands

#### Scenario: Build-time-only secret

- **WHEN** a reader looks up the source-map upload credential
- **THEN** the README shows how to supply it to the build without it becoming a build argument, and states that it does not belong in the container's runtime environment
