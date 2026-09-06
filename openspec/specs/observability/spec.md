## Purpose

Defines how the running site reports its own failures: which unhandled server and client errors reach an external error-tracking backend, which are deliberately suppressed as noise, what performance transactions are emitted, and how browser policy violations are collected — so that a production failure is visible without reading container logs.

## Requirements

### Requirement: Unhandled server errors are reported

An error thrown during server-side rendering, or from any loader, action, or middleware, that is not handled by the application SHALL be reported to the error-tracking backend before the request completes, and SHALL also remain visible in the process's standard error output.

#### Scenario: Loader throws

- **WHEN** a route loader throws an unexpected error during a document request
- **THEN** an event for that error appears in the error-tracking project, carrying the error's message and server stack frames, and the error is also written to the process log

#### Scenario: Reporting failure does not break the response

- **WHEN** the error-tracking backend is unreachable while an unhandled server error is being reported
- **THEN** the request still completes with the application's normal error response, and the site does not hang or return a second, different failure

### Requirement: Aborted requests are not reported

An error surfaced because the client disconnected or the request was otherwise aborted SHALL NOT be reported. Only errors on requests whose signal is still live are treated as failures.

#### Scenario: Client navigates away mid-render

- **WHEN** a visitor cancels an in-flight document request and the server render is interrupted
- **THEN** no event is sent to the error-tracking backend for that interruption

### Requirement: Unhandled client errors are reported

An uncaught exception, an unhandled promise rejection, or an error that reaches the application's root error boundary in the browser SHALL be reported to the error-tracking backend.

#### Scenario: Component throws after hydration

- **WHEN** a client-side interaction throws an error that reaches the root error boundary
- **THEN** an event for that error appears in the error-tracking project, and the visitor still sees the application's error UI rather than a blank page

#### Scenario: Uncaught rejection

- **WHEN** a promise rejects in browser code with no rejection handler
- **THEN** an event for that rejection appears in the error-tracking project

### Requirement: Expected 404 responses are not reported

A route error response with status 404 SHALL NOT produce an error event on either the server or the client. A request for a page that does not exist is a normal outcome, not a failure.

#### Scenario: Visitor requests a missing page

- **WHEN** a request is made for a URL that matches no route or for a workbench slug that does not exist
- **THEN** the not-found page renders and no event is sent to the error-tracking backend

#### Scenario: Non-404 route error response

- **WHEN** a route throws a route error response with a status other than 404
- **THEN** that error is reported

### Requirement: Errors are not reported from local development

Error and transaction reporting SHALL be inactive when the application runs outside a production build, so that local iteration does not pollute the production error feed.

#### Scenario: Error thrown on the dev server

- **WHEN** an unhandled error occurs while running the development server
- **THEN** it is written to the console and no event reaches the error-tracking backend

### Requirement: Performance transactions are reported

Server request handling — including loader, action, and middleware execution — and client-side route navigations SHALL produce performance transactions in the error-tracking backend, sampled at a configured rate.

#### Scenario: Document request produces a server transaction

- **WHEN** a document request is served in production and that request falls within the trace sample
- **THEN** a transaction for that request appears in the backend's performance view, with spans covering the loaders and middleware that ran

#### Scenario: Client navigation produces a transaction

- **WHEN** a visitor navigates between routes in the browser and the navigation falls within the trace sample
- **THEN** a navigation transaction for that route change is reported

### Requirement: Session tracking is disabled

The application SHALL NOT emit session or session-aggregate envelopes from either the browser or the server. The configured backend does not implement the sessions API, so such envelopes are discarded and represent pure waste.

#### Scenario: Page load in production

- **WHEN** a visitor loads any page in production
- **THEN** no session envelope is sent from the browser, on load or on unload

#### Scenario: Server handles a request

- **WHEN** the server handles an incoming HTTP request in production
- **THEN** no session-aggregate envelope is sent for it

### Requirement: Document responses carry a report-only content security policy

Every HTML document response SHALL include a `Content-Security-Policy-Report-Only` header. The policy SHALL be report-only: it SHALL NOT be sent as an enforcing `Content-Security-Policy` header, and no resource the site loads may be blocked by it. The policy SHALL declare a reporting destination so that violations are collected centrally.

#### Scenario: Policy is advisory, not enforcing

- **WHEN** any page is loaded
- **THEN** the response carries `Content-Security-Policy-Report-Only` and no `Content-Security-Policy` header, and the page renders, styles, fonts, theme switching, and analytics all behave exactly as they did before the policy existed

#### Scenario: Violation is reported

- **WHEN** the browser loads a resource the policy does not permit
- **THEN** the resource still loads, and the browser posts a violation report to the configured reporting destination

#### Scenario: Non-document responses

- **WHEN** a non-HTML response is served, such as the RSS feed, the sitemap, or a static asset
- **THEN** no content security policy header is attached to it

### Requirement: Inline scripts are permitted by nonce, not by blanket allowance

The policy's script directive SHALL permit the application's own inline scripts by a per-response nonce, and SHALL NOT permit inline script by a blanket `'unsafe-inline'` allowance. Every inline script the application emits — the pre-hydration theme script and the framework's own hydration scripts — SHALL carry that response's nonce.

#### Scenario: Nonce is unique per response

- **WHEN** two document responses are compared
- **THEN** the nonce in each response's policy header differs, and each matches the nonce attribute on every inline script in that response's body

#### Scenario: No inline script is left unnonced

- **WHEN** a rendered page's inline scripts are inspected
- **THEN** every one carries the response nonce, and no violation report is generated for the site's own scripts

### Requirement: Reporting destination is derived, not separately configured

The content security policy's reporting destination and the error-tracking ingest origin SHALL both be derived from the single configured error-tracking endpoint. Neither SHALL be declared as an independent configuration value that could diverge from it.

#### Scenario: Endpoint is repointed

- **WHEN** the configured error-tracking endpoint is changed to a different host or project
- **THEN** error reporting, transaction reporting, the policy's reporting destination, and the policy's allowance for the backend's origin all follow it, with no second value to update

#### Scenario: Malformed endpoint

- **WHEN** the configured endpoint cannot be parsed into a host, project, and key
- **THEN** startup fails with an error naming the offending variable and containing no substring of its value

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
