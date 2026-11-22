## MODIFIED Requirements

### Requirement: Home integrations panel names the services the site runs on

The Home integrations panel SHALL present the third-party services and core tools this application integrates with, as a worked example of the site's own construction. It SHALL cover Featurevisor, OpenPanel, MDX, and GlitchTip, and for each SHALL show the service name, the moment in a page's lifecycle at which it acts, the role it plays in this application, and the consequence of that role for someone reading the site. Entries SHALL be ordered by that lifecycle moment, from before the request through to failure, so the ordering carries meaning rather than being arbitrary.

The panel SHALL describe the integrations at the level of what they do, never at the level of how they are built: it SHALL NOT name a source file, directory, module, package, function, or configuration key. The panel SHALL be introduced by a section heading and a lead line, in the same section rhythm as the workbench and tools previews.

The panel SHALL be descriptive only. It SHALL NOT read a feature flag value, send an analytics event on render, report an error, or make any network request to the named services. Its rendered output SHALL be identical whether or not those services are configured, reachable, or enabled.

#### Scenario: All four integrations are presented
- **WHEN** the Home integrations panel renders
- **THEN** exactly one entry appears for each of Featurevisor, OpenPanel, MDX, and GlitchTip
- **AND** each entry shows the service name, its lifecycle moment, its role in this application, and the consequence of that role
- **AND** the entries appear in lifecycle order: content build, then render, then visitor action, then failure

#### Scenario: No implementation detail is exposed
- **WHEN** the rendered text of the integrations panel is inspected
- **THEN** it contains no file path, directory name, module name, package name, or configuration key
- **AND** each entry is legible to a reader who has never seen the repository

#### Scenario: Panel is inert with respect to the services
- **WHEN** the Home page is rendered with OpenPanel and GlitchTip unconfigured or unreachable
- **THEN** the integrations panel renders exactly the same content as when they are configured
- **AND** rendering the panel produces no request to any of those services and no analytics event

#### Scenario: Heading structure stays valid
- **WHEN** the Home markup is inspected
- **THEN** the integrations panel contributes one `h2` for the section and one `h3` per integration entry
- **AND** the page still contains exactly one `h1`

#### Scenario: Content is authored copy, not content-layer data
- **WHEN** an integration entry's wording is changed
- **THEN** the change is made in the design-bound copy in source
- **AND** no MDX content file is added, edited, or removed

#### Scenario: Renders in both modes
- **WHEN** the integrations panel is rendered in light and in dark mode
- **THEN** every entry is legible with no undefined colours, and the panel is distinguishable from the section above it

#### Scenario: Works without JavaScript
- **WHEN** the Home page is fetched with JavaScript disabled
- **THEN** the integrations panel and all four entries are present in the server-rendered markup
- **AND** any link in the panel is a real anchor that navigates
