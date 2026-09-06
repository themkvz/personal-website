## Purpose

Defines the contract the production container image must satisfy so the site can be deployed to any container host: what the image needs at build time versus run time, how large and privileged the runtime is, what port it binds, and how a supervisor determines the container is healthy.

## Requirements

### Requirement: Reproducible build from a clean checkout

The image build SHALL succeed from a clean checkout with no `.env` file present. Every value the client bundle inlines at build time SHALL be supplied as a declared build argument, and the build SHALL fail loudly rather than produce an image whose client bundle is missing required configuration.

#### Scenario: Build with required build args

- **WHEN** the image is built from a checkout with no `.env` file, passing `VITE_OP_CLIENT_ID`, `VITE_OP_API_URL`, and `VITE_GLITCHTIP_DSN` as build arguments
- **THEN** the build succeeds and the resulting client bundle contains those values

#### Scenario: Build without required build args

- **WHEN** the image is built without supplying a required client build argument
- **THEN** the build fails with a message naming the missing argument

#### Scenario: Build context excludes local secrets

- **WHEN** the image is built from a checkout that does have a local `.env` file
- **THEN** that file is excluded from the build context and does not reach any build stage

### Requirement: Minimal runtime image

The published image SHALL contain only what is needed to serve the built application: the production dependency tree, the build output, and the package manifest. Build-time tooling, development dependencies, source files, and planning artifacts SHALL NOT be present in the final image.

#### Scenario: Development dependencies are absent
- **WHEN** the final image filesystem is inspected
- **THEN** it contains no development dependencies, no application source directory, and no build toolchain beyond the runtime

#### Scenario: Image size
- **WHEN** the final image is measured
- **THEN** it is materially smaller than an equivalent image built on the full Debian-based runtime, and the reduction is verified by comparing `docker image ls` output before and after

### Requirement: Unprivileged runtime

The container SHALL run its application process as a non-root user, and the application SHALL NOT require write access to any path outside its own writable temp space.

#### Scenario: Process user
- **WHEN** `id -u` is executed inside a running container
- **THEN** it reports a non-zero user id

### Requirement: Configurable listen port

The server SHALL bind the port given by the `PORT` environment variable, defaulting to 3000 when it is unset.

#### Scenario: Default port
- **WHEN** the container is started without `PORT` set
- **THEN** the server accepts HTTP requests on port 3000

#### Scenario: Overridden port
- **WHEN** the container is started with `PORT` set to another value
- **THEN** the server accepts HTTP requests on that port and not on 3000

### Requirement: Runtime environment contract

The container SHALL receive its server-side configuration at run time, not bake it into the image. `OP_CLIENT_SECRET`, `VITE_OP_CLIENT_ID`, `VITE_OP_API_URL`, and `VITE_GLITCHTIP_DSN` are required at run time by server env validation; `NODE_ENV` SHALL default to `production` in the image.

#### Scenario: Missing runtime secret

- **WHEN** the container is started without `OP_CLIENT_SECRET`
- **THEN** the process exits with an env-validation error naming the missing variable, rather than starting in a degraded state

#### Scenario: Missing error-tracking endpoint

- **WHEN** the container is started without `VITE_GLITCHTIP_DSN`
- **THEN** the process exits with an env-validation error naming that variable, rather than starting with error reporting silently disabled

#### Scenario: Production mode by default

- **WHEN** the container is started without `NODE_ENV` set
- **THEN** the application runs in production mode

### Requirement: Container healthcheck

The image SHALL declare a healthcheck that probes the running HTTP server on its configured port, so an orchestrator can distinguish a started container from a serving one.

#### Scenario: Healthy container
- **WHEN** the server is accepting requests
- **THEN** the container's health status becomes `healthy`

#### Scenario: Unhealthy container
- **WHEN** the server process is stopped or never begins listening
- **THEN** the container's health status becomes `unhealthy`

### Requirement: Documented deploy procedure

The repository README SHALL document the production deploy procedure: the build command with its required build arguments, the run command with its required runtime environment variables, and which variables belong to which phase. Where a variable is required in both phases, the README SHALL say so.

#### Scenario: Following the README

- **WHEN** a reader follows the README Deployment section on a machine with Docker and no prior knowledge of the project
- **THEN** they can build and run the image without consulting the Dockerfile

#### Scenario: Variable required in both phases

- **WHEN** a reader looks up a `VITE_`-prefixed variable that the client bundle inlines at build time and server validation also requires at run time
- **THEN** the README shows it in both the build and run commands
