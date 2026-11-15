# Instructions for AI coding agents

## Mission

Modify this back-office TypeScript project while preserving its existing architecture and conventions. Do not replace its stack or introduce a new application pattern unless the user explicitly requests it.

## Read these documents first

1. [`README.md`](README.md) — human overview and repository map.
2. [`docs/source-coverage.md`](docs/source-coverage.md) — what is and is not present in the supplied source archive. This is mandatory reading before backend changes.
3. [`docs/architecture.md`](docs/architecture.md) — verified runtime architecture and wiring.
4. [`docs/database.md`](docs/database.md) — supplied PostgreSQL schema, relationships, and status/permission caveats.
5. [`docs/development.md`](docs/development.md) — TypeScript, formatting, dependencies, and commands.
6. [`docs/ui-conventions.md`](docs/ui-conventions.md) — Nunjucks template and page conventions.
7. [`docs/feature-playbook.md`](docs/feature-playbook.md) — safe workflow for adding a feature.

## Ground-truth rules

- Treat checked-in source files as the authority for implementation details.
- Treat the DDL in `docs/database.md` as the supplied database contract. Do not invent columns, foreign keys, indexes, constraints, enum values, or relationships that are not present there.
- The archive used to create these docs is missing `service/`, `client/`, and `public/`. The imports from `./service` and `./service/template` in `server.ts` are therefore unresolved in this archive. Do not invent controller, service, repository, context, route, validation, or SQL-helper APIs.
- Before implementing backend logic, locate the missing original source or obtain a complete repository snapshot. If it is still unavailable, clearly state which behavior must be designed rather than claiming to follow an existing backend pattern.
- Do not infer that a package has a particular API just from its name. Inspect its use in this repository or its installed type declarations/documentation before calling it.
- Do not copy secrets from `.env` or `config.ts` into code, documentation, logs, examples, or generated files. Use environment configuration and secret management.
- Do not silently fix unrelated template inconsistencies while implementing a feature. Call them out separately unless the requested change requires them.

## Preserve the observed stack

- TypeScript, Node.js, Express 5, Nunjucks, PostgreSQL.
- Server-rendered HTML templates under `views/`.
- PostgreSQL pool setup through `pg` and `PoolManager` from `postgres-kit`.
- Runtime bootstrapping in `server.ts`; configuration and SQL strings in `config.ts`.
- Existing middleware integrations: cookie parsing, JWT verification, request logging, and the project context passed to `route(app, ctx)`.
- Existing shared dependencies should be reused where their APIs are verified. Avoid adding a framework or parallel architecture without a requirement.

## TypeScript and formatting

- Follow `tsconfig.json`: strict type checking, NodeNext module/module-resolution settings, `esModuleInterop`, and consistent filename casing.
- Follow `.prettierrc.json`: 2-space indentation, no semicolons, double quotes, trailing commas, and a print width of 160.
- Keep imports and code style consistent with neighboring files. The supplied TypeScript sample is limited to `server.ts` and `config.ts`; do not infer detailed service-layer conventions from those two files.

## Naming and data mapping

- Database identifiers are predominantly `snake_case`.
- Nunjucks view model properties and HTML form names use `camelCase` in the visible templates (for example `userId`, `displayName`, `currencyCode`, `decimalDigits`).
- `config.ts` contains an explicit SQL alias/mapping example (`user_id` to `userId`, `display_name` to `displayName`, and related authentication fields). Follow the mapping used by the relevant existing feature once its service code is available.
- Do not assume every database column has a global automatic camel-case mapping; that implementation is not present in the archive.

## UI rules

- Use Nunjucks templates, not React/Vue/Angular, for the existing back-office screens.
- Reuse the established files under `views/partials/` for common layout/search/pagination/resource fragments where appropriate.
- Use `resource.*` for localized UI text, matching neighboring templates.
- Match the existing form identifiers, field naming, and inline event-handler style only when the relevant helper implementation is available and verified. Browser scripts referenced under `/static/` are missing from the archive.
- Keep list and detail screens consistent with the examples documented in `docs/ui-conventions.md`.

## Database and authorization safety

- Respect the supplied primary keys and status fields.
- The module authorization queries in `config.ts` use `modules`, `roles`, `user_roles`, and `role_modules`. Keep menu visibility/authorization and server-side authorization conceptually separate; a hidden menu item is not proof that an endpoint is protected.
- `modules.actions` and `role_modules.permissions` are integers, but their bit assignments are not defined in the supplied source. Never invent bit meanings.
- Status values are context-specific. Do not impose a universal `A`/`I` or `A`/`D` convention; see `docs/database.md`.
- Do not expose or log password hashes, passcodes, JWTs, remember tokens, or other authentication secrets.

## Expected change workflow

1. Inspect the closest existing feature and its full vertical slice (route, controller, service, SQL/repository, view, and browser behavior) before editing.
2. Confirm the relevant schema columns and intended status/permission semantics.
3. Reuse the existing implementation pattern. If the required layer is absent, stop short of fabricating it and explain the missing dependency/source.
4. Implement the smallest coherent change, including validation, error handling, authorization, audit/history behavior when required by the established pattern, and UI messages.
5. Update relevant templates and localization resources using the existing resource mechanism.
6. Run the available checks. Report commands that could not be run and why.
7. Summarize changed files, behavior, schema impact, authorization impact, and tests.

## Output expectations

When asked to add a feature, provide a concise implementation summary and explicitly list unresolved assumptions or missing files. Never claim tests/builds passed unless they were actually run successfully.
