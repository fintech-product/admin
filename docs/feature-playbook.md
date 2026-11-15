# Feature implementation playbook

Use this checklist when adding a back-office feature. The current archive is incomplete, so backend-specific steps must wait until the original service source is available.

## 1. Identify the vertical slice

Before editing, locate the closest comparable feature and inspect all layers:

- Route registration and middleware.
- Controller/request handler.
- Service/business logic.
- SQL/repository/query construction.
- View-model mapping.
- Nunjucks list/detail/assignment templates.
- Browser-side form/search helpers.
- Localization/resource definitions.
- Authorization and audit/history behavior.
- Tests.

For the supplied archive, only the template/config/bootstrap pieces are present. Do not manufacture the absent layers.

## 2. Confirm the data contract

- Map each requested field to an existing database column.
- Confirm the primary key and any intended relationships.
- Confirm how status values work for that table. Do not assume `A`/`I` for users; `config.ts` uses `A`/`D` for user activation.
- Confirm any `actions`/`permissions` bitmask meanings from the original source or an authoritative product specification.
- Determine whether audit logs or generic histories are expected for the operation. Their write implementation is not included in the archive.
- Avoid schema changes unless required by the feature. If needed, provide explicit migration SQL and explain compatibility impact.

## 3. Match existing screen patterns

For a conventional master-data CRUD screen, use the visible examples as a starting point:

- List screen: heading, readonly-aware New link, filter form, shared search/pagination includes, sortable table, Nunjucks loop.
- Detail screen: named form, Back control, resource-based labels, camelCase form names, field constraints, readonly/edit handling, Save button.
- Keep resource labels in `resource.*` rather than hard-coding user-facing text.
- Reuse shared partials where their inputs and behavior match.

Do not implement a new global browser helper until the missing `/static/` source is available and inspected.

## 4. Authorization

The visible module model connects modules to roles using `role_modules`, with users assigned to roles through `user_roles`. The configured SQL retrieves module privileges and module-specific `permissions` values.

Before adding an endpoint:

- Confirm the existing server-side authorization middleware/check.
- Confirm which module id protects the feature.
- Confirm the permission integer semantics from source.
- Enforce authorization server-side; hiding a navigation link is not sufficient.
- Consider both direct URL access and action-level permission checks.

No permission bit definitions or request guard implementation are present in the archive.

## 5. Data validation and safety

- Validate on the server even when the view has HTML constraints.
- Follow the existing validation library only after inspecting its usage in the restored source; dependencies alone do not establish an API pattern.
- Use parameterized database queries. Do not concatenate user-controlled values into SQL.
- Do not expose password hashes, passcodes, tokens, or authentication history.
- Keep error messages localized using the existing resource mechanism.
- Preserve date/time, locale, number, and currency behavior for fields that depend on locale settings.

## 6. Verification

- Run the project build and test commands that are actually available after the missing source/assets are restored.
- Add tests matching the existing test framework (not identifiable in this archive).
- Manually verify list filtering, pagination, sorting, detail read/edit/create behavior, validation, readonly access, and authorization.
- Verify DB writes and audit/history effects where applicable.
- Report missing tests or unavailable commands honestly.

## 7. Change summary

For a completed feature, report:

- New/changed files.
- User-visible behavior and routes.
- Database changes/migration impact.
- Authorization requirements and checks.
- Validation and error handling.
- Test/build results.
- Remaining assumptions or source gaps.
