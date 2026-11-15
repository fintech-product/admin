# Source coverage and known gaps

## Archive contents inspected

The uploaded `admin.zip` contains 38 entries, including:

- `server.ts`, `config.ts`, `package.json`, `package-lock.json`, `tsconfig.json`, `.prettierrc.json`, and `webpack.config.js`.
- Nunjucks templates under `views/`, including layout, sign-in, feature pages, shared partials, and a user lookup component.
- A `.env` file. Its contents are intentionally not reproduced in these docs.

## Referenced but absent paths

| Missing path | Evidence of reference | Consequence |
|---|---|---|
| `service/` | `server.ts` imports `./service` and `./service/template`; `tsconfig.json` includes `service/**/*.ts` | Routes, context composition, controllers, services, SQL/repository code, and template helpers cannot be analyzed |
| `client/` | `tsconfig.json` includes `client/**/*.ts` but also excludes `./client` | Client TypeScript cannot be analyzed |
| `public/` | `server.ts` serves `__dirname + "/public"`; templates reference `/static/*.js`, fonts, and images | Browser helper implementations and static styling/assets cannot be inspected |
| Tests | `package.json` test script is a placeholder that exits with status 1 | Existing test conventions and coverage are unknown |

These are missing from the supplied archive; this does not prove that the original repository does not contain them.

## What was verified

- Express app/bootstrap and middleware construction in `server.ts`.
- Base configuration, environment overlays, authentication query, field mapping, and authorization SQL in `config.ts`.
- TypeScript compiler settings, package dependencies/scripts, Prettier settings, and webpack configuration.
- Page structure, template variables, event-handler names, shared partial usage, and visible forms/tables in `views/`.
- The database schema and seed statements supplied in the user request.

## What was not verified

- Actual route URLs/HTTP methods and route-to-template mapping beyond the paths seeded in `modules` and links written in templates.
- `route`, `useContext`, `resources`, controller/service/repository APIs, query execution, SQL helpers, transaction strategy, row mapping, error handling, and validation implementation.
- The details of token issuance, refresh/remember-token lifecycle, password hashing, passcode delivery, lockout behavior, and logout implementation.
- Permission/action bit values and their mapping to UI/server operations.
- How menu HTML is generated, how localization files are loaded, and how per-user locale settings affect rendering.
- Browser-side navigation, form submission, AJAX, validation, search, pagination, sorting, toast, and alert implementations.
- Database migrations, actual constraints/indexes, test framework, deployment process, CI/CD, and production environment setup.

## Recommended next input for a complete analysis

Provide a complete repository archive that includes at least `service/`, `public/`, and any `client/` source that is part of the app. Include tests and migration/schema files if available. Do not include live secrets; redact `.env` values and credentials before sharing.

With those files, the AI documentation can be refined to include the actual route map, service/repository patterns, query conventions, middleware/authorization flow, validation rules, browser helper contracts, and examples of complete feature vertical slices.
