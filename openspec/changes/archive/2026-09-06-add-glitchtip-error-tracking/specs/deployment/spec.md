## MODIFIED Requirements

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

### Requirement: Documented deploy procedure

The repository README SHALL document the production deploy procedure: the build command with its required build arguments, the run command with its required runtime environment variables, and which variables belong to which phase. Where a variable is required in both phases, the README SHALL say so.

#### Scenario: Following the README

- **WHEN** a reader follows the README Deployment section on a machine with Docker and no prior knowledge of the project
- **THEN** they can build and run the image without consulting the Dockerfile

#### Scenario: Variable required in both phases

- **WHEN** a reader looks up a `VITE_`-prefixed variable that the client bundle inlines at build time and server validation also requires at run time
- **THEN** the README shows it in both the build and run commands
