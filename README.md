# admin

A TypeScript/Express back-office application with server-rendered Nunjucks pages and a PostgreSQL database. The visible screens cover user and role administration, access-log viewing, and master-data maintenance for currencies, countries, and locales.

> **Source coverage note:** The supplied archive contains `server.ts`, `config.ts`, build configuration, and Nunjucks templates, but it does not contain the `service/`, `client/`, or `public/` directories referenced by the application. This README describes only what can be verified from the supplied files and the database DDL supplied with the project. The backend route, controller, service, repository, and browser-script conventions cannot yet be verified.

## What is included

- **Server:** Express 5 application bootstrap in `server.ts`.
- **Views:** Nunjucks templates in `views/`, organized into page templates, reusable partials, and a user-lookup component.
- **Database:** PostgreSQL, connected through `pg.Pool` and `PoolManager` from `postgres-kit`.
- **Authentication integration:** JWT middleware from `express-jsonwebtoken`, with authentication-related configuration in `config.ts`.
- **Authorization configuration:** SQL statements in `config.ts` that derive module privileges and per-module permissions from user-role and role-module assignments.
- **Shared TypeScript packages:** Dependencies such as `onecore`, `postgres-kit`, `sql-core`, `authen-service`, `security-express`, `admin-menu`, `locale-service`, and `logger-core`.

## Main screens

| Area | View templates | Database entities represented in the supplied schema |
|---|---|---|
| User management | `views/pages/users.html`, `user.html`, `user-assign.html` | `users`, `passwords`, `user_roles`, `roles` |
| Role management | `views/pages/roles.html`, `role.html`, `role-assign.html` | `roles`, `role_modules`, `modules`, `user_roles`, `users` |
| Audit logs | `views/pages/audit-logs.html` | `audit_logs` |
| Currency management | `views/pages/currencies.html`, `currency.html` | `currency` |
| Country management | `views/pages/countries.html`, `country.html` | `country` |
| Locale management | `views/pages/locales.html`, `locale.html` | `locale`, `country`, `currency` (the exact query behavior is not included) |

The module seed data in the supplied SQL defines `/users`, `/roles`, `/audit-logs`, `/currencies`, `/countries`, and `/locales` paths. Some templates contain navigation links to additional areas that are not represented by the supplied database schema or complete application source.

## Repository map

```text
.
├── README.md
├── AGENTS.md
├── config.ts                 # Runtime, auth, DB and privilege SQL configuration
├── server.ts                 # Express/Nunjucks/PostgreSQL bootstrap
├── package.json
├── tsconfig.json
├── webpack.config.js
├── views/
│   ├── layout.html            # Main authenticated application shell
│   ├── signin.html            # Sign-in view
│   ├── components/
│   │   └── users-lookup.html
│   ├── pages/                 # List/detail/assignment screens
│   └── partials/              # Shared UI fragments
└── docs/
    ├── architecture.md
    ├── database.md
    ├── development.md
    ├── ui-conventions.md
    ├── feature-playbook.md
    └── source-coverage.md
```

The archive does **not** include the `service/`, `client/`, or `public/` directories referenced in the configuration and templates. See [Source coverage](docs/source-coverage.md).

## Run and build

The package scripts currently declare:

```bash
npm install
npm start       # nodemon + ts-node-dev server.ts
npm run build   # webpack bundle
npm run prod    # node server.js
```

The server expects a PostgreSQL database and runtime configuration. Do not use the example/default credentials or secrets in `config.ts` for a deployed environment. Configure secrets outside source control and review the environment-specific overrides before running.

The supplied `package.json` has no working test script; its `test` command intentionally exits with an error. The supplied archive is incomplete, so a successful application build or runtime start cannot be established from this archive alone.

## Documentation for AI coding agents

Start with [`AGENTS.md`](AGENTS.md). It links to the architecture, database, development, UI, feature workflow, and source-coverage documents. These files distinguish verified behavior from missing implementation details to prevent fabricated APIs or coding conventions.
