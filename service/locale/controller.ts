import { Request, Response } from "express"
import {
  buildMessage,
  buildPages,
  buildPageSearch,
  buildSortSearch,
  escape,
  escapeArray,
  fromRequest,
  getOffset,
  getSearch,
  handleError,
  hasSearch,
  isSuccessful,
  resources,
  respondError
} from "express-ext"
import { write } from "security-express"
import { validate } from "xvalidators"
import { getLang, getResource } from "../resources"
import { render, renderError403, renderError404, renderError500 } from "../template"
import { Locale, LocaleFilter, localeModel, LocaleService } from "./locale"

function createLocale(): Locale {
  const locale = {} as Locale
  return locale
}
const fields = ["id", "name", "path", "icon", "type", "resource", "parent", "sequence", "status"]
export class LocaleController {
  constructor(private service: LocaleService) {
    this.search = this.search.bind(this)
    this.view = this.view.bind(this)
    this.submit = this.submit.bind(this)
  }
  async search(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    let filter: LocaleFilter = { limit: resources.defaultLimit }
    if (hasSearch(req)) {
      filter = fromRequest<LocaleFilter>(req)
    }
    const { page, limit, sort } = filter
    const offset = getOffset(limit, page)
    try {
      const result = await this.service.search(filter, limit, page)
      const list = escapeArray(result.list, offset, "sequence")
      const search = getSearch(req.url)
      const permissions = res.locals.permissions as number
      const readonly = write != (write & permissions)
      render(req, res, "locales", {
        resource,
        readonly,
        limits: resources.limits,
        filter,
        list,
        pages: buildPages(limit, result.total),
        pageSearch: buildPageSearch(search),
        sort: buildSortSearch(search, fields, sort),
        message: buildMessage(resource, list, limit, page, result.total),
      })
    } catch (err) {
      renderError500(req, res, resource, err)
    }
  }
  async view(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const id = req.params.id
    const editMode = id !== "new"
    const permissions = res.locals.permissions as number
    const readonly = write != (write & permissions)
    if (!editMode) {
      if (readonly) {
        return renderError403(req, res, resource)
      }
      const locale = createLocale()
      render(req, res, "locale", {
        resource,
        editMode,
        locale: escape(locale),
      })
    } else {
      try {
        const locale = await this.service.load(id)
        if (!locale) {
          return renderError404(req, res, resource)
        }
        render(req, res, "locale", {
          resource,
          readonly,
          editMode,
          locale: escape(locale),
        })
      } catch (err) {
        renderError500(req, res, resource, err)
      }
    }
  }
  async submit(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const locale = req.body
    const errors = validate<Locale>(locale, localeModel, resource)
    if (errors.length > 0) {
      return respondError(res, errors)
    }
    const userId = res.locals.userId
    locale.updatedBy = userId
    const id = req.params.id
    const editMode = id !== "new"
    try {
      if (!editMode) {
        locale.createdBy = userId
        const result = await this.service.create(locale)
        const status = isSuccessful(result) ? 201 : 409
        res.status(status).json(result).end()
      } else {
        const result = await this.service.update(locale)
        const status = isSuccessful(result) ? 200 : 410
        res.status(status).json(result).end()
      }
    } catch (err) {
      handleError(err, res)
    }
  }
}
