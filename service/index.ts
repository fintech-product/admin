import { Application, json, urlencoded } from "express"
import { read, write } from "security-express"
import { Context } from "./context"

export * from "./context"

export const approve = 8
// const parser = multer()

export function route(app: Application, ctx: Context): void {
  app.get("/health", ctx.health.check)
  app.patch("/log", ctx.log.config)
  app.patch("/middleware", ctx.middleware.config)

  app.get("", ctx.login.render)
  app.get("/login", ctx.login.render)
  app.post("", urlencoded(), ctx.login.submit)
  app.post("/login", urlencoded(), ctx.login.submit)

  const readRole = ctx.authorize("role", read)
  const writeRole = ctx.authorize("role", write)
  app.get("/roles", readRole, ctx.menu.build, ctx.role.search)
  app.get("/roles/:id", readRole, ctx.menu.build, ctx.role.view)
  app.post("/roles/:id", writeRole, json(), ctx.role.submit)
  app.get("/roles/:id/assign", readRole, ctx.menu.build, ctx.role.renderAssign)
  app.patch("/roles/:id/assign", writeRole, ctx.menu.build, json(), ctx.role.assign)

  const readUser = ctx.authorize("user", read)
  const writeUser = ctx.authorize("user", write)
  app.get("/users", readUser, ctx.menu.build, ctx.user.search)
  app.get("/users/:id", readUser, ctx.menu.build, ctx.user.view)
  app.post("/users/:id", writeUser, json(), ctx.user.submit)
  app.get("/users/:id/assign", readUser, ctx.menu.build, ctx.user.renderAssign)
  app.patch("/users/:id/assign", writeUser, ctx.menu.build, json(), ctx.user.assign)

  const readAuditLog = ctx.authorize("audit_log", read)
  app.get("/audit-logs", readAuditLog, ctx.menu.build, ctx.auditLog.render)

  const readCurrency = ctx.authorize("currency", read)
  const writeCurrency = ctx.authorize("currency", write)
  app.get("/currencies", readCurrency, ctx.menu.build, ctx.currency.search)
  app.get("/currencies/:id", readCurrency, ctx.menu.build, ctx.currency.view)
  app.post("/currencies/:id", writeCurrency, json(), ctx.currency.submit)

  const readCountry = ctx.authorize("country", read)
  const writeCountry = ctx.authorize("country", write)
  app.get("/countries", readCountry, ctx.menu.build, ctx.country.search)
  app.get("/countries/:id", readCountry, ctx.menu.build, ctx.country.view)
  app.post("/countries/:id", writeCountry, json(), ctx.country.submit)

  const readLocale = ctx.authorize("locale", read)
  const writeLocale = ctx.authorize("locale", write)
  app.get("/locales", readLocale, ctx.menu.build, ctx.locale.search)
  app.get("/locales/:id", readLocale, ctx.menu.build, ctx.locale.view)
  app.post("/locales/:id", writeLocale, json(), ctx.locale.submit)
}
