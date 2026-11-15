# Nunjucks UI conventions

This document describes patterns visible in the supplied HTML templates. It does not describe the missing browser-side JavaScript implementation.

## Template structure

- `views/layout.html` is the main page shell. It includes `partials/common.html`, `partials/navigation.html`, and `partials/header.html`, then renders the page-specific `{% block content %}`.
- `views/signin.html` is a standalone sign-in page.
- Feature page templates are under `views/pages/`.
- Reusable fragments are under `views/partials/`.
- `views/components/users-lookup.html` is a reusable/example user lookup fragment.

The Nunjucks environment is configured in `server.ts` with `autoescape: false`. Be careful when rendering untrusted values; do not assume output escaping is automatically enabled.

## Localized labels and resources

Use `{{resource.some_key}}` for visible text, placeholders, button labels, messages, and headings. `views/partials/resource.html` exposes a subset of localized messages to browser JavaScript through a `resource` object and `getResource()`.

The mechanism that loads translations and builds the `resource` object is not included. Do not invent resource file names or backend translation APIs.

## List-page pattern

Existing list templates generally follow this shape:

1. Page heading inside `<header>`.
2. New-record link if `readonly == false`.
3. Search/filter `<form>` with a page-specific form id/name.
4. Shared `partials/advance-search.html` and `partials/pagination.html` includes where applicable.
5. Optional advanced filters inside a hidden `.advance-search` section.
6. Hidden `page` field bound to `filter.page` where used.
7. Responsive HTML table with sortable header links.
8. `{% for item in list %}` to render records.

Examples: `currencies.html`, `countries.html`, `locales.html`, `users.html`, `roles.html`, and `audit-logs.html`.

The shared search partial expects values such as `limits`, `filter.limit`, `filter.q`, and `resource.search`. Sortable columns use values such as `sort.code.url` and `sort.code.tag`.

## Detail-page pattern

Detail templates generally:

- Render a `<form>` with a feature-specific id/name, for example `currencyForm`, `countryForm`, `localeForm`, `userForm`, or `roleForm`.
- Render a back button that calls `goBack()`.
- Bind values from a feature object, such as `currency.code` or `user.displayName`.
- Use camelCase HTML `name` attributes and view-model properties.
- Render localized labels using `resource.*`.
- Use `required`, `maxlength`, `min`, and `max` constraints in the markup where appropriate.
- Use radio groups for active/inactive status in detail forms.
- Call `submitForm(event)` from the submit button and disable the button when `readonly` is true.

For edit forms, stable identifier fields are often marked `readonly` when `editMode` is true. The precise server validation and persistence behavior is not in the archive.

## Status and field examples

Visible master-data templates use `A` and `I` for active/inactive radio buttons or checkboxes. User activation is configured differently in `config.ts` (`A`/`D`), so do not apply a one-size-fits-all status mapping.

Template field examples:

- Currency: `code`, `symbol`, `decimalDigits`, `status`.
- Country: `countryCode`, `countryName`, `nativeCountryName`, `dateFormat`, separator/currency fields, `status`.
- Locale: `code`, `name`, `nativeName`, country/date/number/currency fields, `status`.
- User: `userId`, `username`, `displayName`, `title`, `position`, `phone`, `email`, and profile settings.
- Role: `roleId`, `roleName`, `remark`, `status`.

These are presentation model names and should not be mistaken for database column names.

## Form and browser event conventions

Templates call global functions such as:

- `navigate(event)`
- `submitForm(event)`
- `search(event)`
- `changePage(event)`
- `qOnChange(event)`
- `clearText(event)`
- `toggleSearch(event)`
- `goBack()`
- `requiredOnBlur(event)`
- `digitOnKeyDown(event)`
- `numberOnFocus(event)` / `numberOnBlur(event)`
- `assignRolesToUser(event)`
- `assignUsersToRole(event)`

The scripts implementing these functions are referenced under `/static/` from `layout.html`, but the static directory is absent. Match these calls only after inspecting the original helper implementation; do not create new global behavior based on function names alone.

## Shared partials

| Partial | Visible responsibility |
|---|---|
| `partials/common.html` | Toast, loading indicator, alert/confirmation shell |
| `partials/header.html` | Header/search/profile controls |
| `partials/navigation.html` | Navigation container that renders `{{menu}}` |
| `partials/advance-search.html` | Page size, text search, advanced-search toggle |
| `partials/search.html` | Similar search fragment |
| `partials/pagination.html` | Page links driven by `pages`, `filter.page`, and `pageSearch` |
| `partials/resource.html` | Browser-facing localized messages and validation strings |
| `partials/css.html` | Stylesheet includes |

## Preserve existing quirks carefully

The supplied templates contain a few inconsistencies (for example the countries list template uses some locale-oriented form identifiers/links, and there are repeated HTML `id` values in some markup). Do not assume these are intentional project-wide conventions. Avoid propagating them into new templates; flag them separately if they affect the requested feature.
