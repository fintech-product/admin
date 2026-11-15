# Architecture and runtime

## Verified high-level architecture

```mermaid
flowchart TD
    Browser[Browser]
    Express[Express application]
    Static[Static files under public/]
    Views[Nunjucks templates under views/]
    JWT[TokenVerifier middleware]
    Logger[logger-core + MiddlewareLogger]
    Context[useContext(db, logger, middleware, cfg)]
    Routes[route(app, ctx)]
    PG[PostgreSQL]
    Pool[pg.Pool]
    PoolManager[PoolManager from postgres-kit]

    Browser --> Express
    Express --> Static
    Express --> JWT
    Express --> Logger
    Express --> Routes
    Routes --> Context
    Context --> PoolManager
    PoolManager --> Pool
    Pool --> PG
    Routes --> Views
```

This diagram represents only the visible integration points in `server.ts`. The internal structure of `route`, `useContext`, `service/template`, and request handlers cannot be confirmed because `service/` is missing from the archive.

## Server bootstrap (`server.ts`)

The visible bootstrap performs these steps:

1. Imports configuration, Express, Nunjucks, PostgreSQL, logging, cookie parsing, and JWT-verification dependencies.
2. Loads `.env` with `dotenv.config()`.
3. Merges base config, process environment values, environment-specific config, and `process.env.ENV` using `config-plus`.
4. Creates an Express application and exposes `__dirname + "/public"` as a static directory.
5. Configures Nunjucks to render from `views`, associates it with Express, and sets `autoescape: false` and `noCache: false`.
6. Assigns the Nunjucks environment to `resources.nunjucks` from `./service/template`.
7. Creates the logger; wires its error method into the shared `resources` object.
8. Creates `MiddlewareLogger` and `TokenVerifier` instances.
9. Installs `cookieParser()` and `verifier.verify` as application middleware.
10. Creates a `pg.Pool`, wraps it with `PoolManager`, creates a shared context with `useContext`, and passes the app/context to `route`.
11. Starts an HTTP server on `cfg.port`.

The code contains commented-out calls for `buildJavascript()`, `buildCSS()`, a different middleware setup, and `start(app, cfg)`. These are not active runtime behavior in the supplied file.

## Configuration (`config.ts`)

The configuration object contains:

- HTTP port and TLS-related settings.
- CORS-style `allow` settings.
- Logging and request middleware settings.
- LDAP connection/options placeholders.
- PostgreSQL connection configuration.
- JWT and remember-token configuration.
- Authentication status values, lockout settings, auth SQL, and field mappings.
- SQL for all active modules, a user's effective privileges, and a user's permission for one module.

Environment overlays are declared for `sit` and `prd`. The exact merge semantics belong to `config-plus`; do not assume precedence beyond the call visible in `server.ts`.

**Security note:** The supplied `config.ts` contains inline example database/token settings. Treat them as unsafe sample configuration. Do not copy them into new code or deployment documentation. Use environment-specific secret injection and rotate any value that was a real credential.

## Authentication and authorization integration points

`server.ts` constructs `TokenVerifier` using the cookie/token names and secrets from configuration, then installs `verifier.verify`. `config.ts` includes a SQL query joining `users` and `passwords`, plus account lockout fields and status values.

Authorization SQL in `config.ts`:

- `allPrivileges` selects active rows from `modules`.
- `privileges` joins `users` → `user_roles` → `roles` → `role_modules` → `modules`, filters active roles/modules, and returns module metadata plus `permissions` and `actions`.
- `permission` selects distinct `role_modules.permissions` for a user and module, with active user/role/module checks.

The implementation that executes these statements, interprets their results, checks permissions on requests, renders the menu, or writes audit records is not available in the archive. Integer action/permission bit definitions are also absent.

## Server-rendered UI

The visible UI uses Nunjucks:

- `views/layout.html` is the main shell and includes common messages, navigation, header, and CSS/resource partials.
- `views/signin.html` is a separate sign-in page.
- `views/pages/` contains feature pages.
- `views/partials/` contains reusable fragments.
- `views/components/users-lookup.html` contains a user lookup fragment/sample.

The main layout references browser assets under `/static/` (for example `ui.js`, `form.js`, `search.js`, `layout.js`, and `business.js`). Those files are not included in the archive, so event-handler behavior and client-side request protocols are unknown.

## Missing architectural layers

The archive does not include:

- `service/` — imported by `server.ts`; expected to contain at least the route/context/template integration points.
- `client/` — named in `tsconfig.json` include patterns, though it is also excluded there.
- `public/` — referenced as the Express static directory.
- Tests and test configuration.

Do not treat these as empty directories in the original application. Their absence is a limitation of the supplied archive.
