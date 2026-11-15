# Development and coding conventions

## Toolchain

| Concern | Verified setting |
|---|---|
| Runtime framework | Express `^5.3.0` |
| Language | TypeScript `^6.0.3` |
| Module settings | `nodenext` / `nodenext` |
| Target | `es6` |
| Type checking | `strict: true` |
| Database driver | `pg` `^8.23.1` |
| DB wrapper | `postgres-kit` `^0.0.8` |
| View engine | Nunjucks `^3.2.4` |
| JWT integrations | `express-jsonwebtoken`, `jsonwebtoken`, `security-express` |
| Logging | `logger-core`, `express-web-kit` |
| Formatting | `.prettierrc.json` |

The package manifest also includes project/shared packages such as `onecore`, `sql-core`, `config-plus`, `authen-service`, `admin-menu`, `locale-service`, `types-validation`, `validation-core`, and `ui-formatter`. Their internal APIs are not demonstrated in the available source except where referenced in `server.ts` or `config.ts`.

## TypeScript compiler settings

From `tsconfig.json`:

- `target`: `es6`
- `rootDir`: `./`
- `outDir`: `./`
- `module`: `nodenext`
- `moduleResolution`: `nodenext`
- `strict`: `true`
- `esModuleInterop`: `true`
- `skipLibCheck`: `true`
- `forceConsistentCasingInFileNames`: `true`
- Decorator metadata options are enabled.
- `include` references `service/**/*.ts`, `server.ts`, `config.ts`, `client/**/*.ts`, and `build/**/*.ts`.
- `exclude` includes `node_modules` and `./client`.

The `client` include/exclude combination is present as written; do not silently rewrite it without an explicit build requirement.

## Formatting

From `.prettierrc.json`:

```json
{
  "printWidth": 160,
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": false,
  "singleQuote": false
}
```

Observed TypeScript examples use double-quoted imports/strings, no semicolons, and 2-space indentation.

## Package scripts

```bash
npm start       # nodemon --exec ts-node-dev server.ts
npm run build   # webpack --config webpack.config.js
npm run prod    # node server.js
npm test        # currently prints 
