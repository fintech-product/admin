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
import { Currency, CurrencyFilter, currencyModel, CurrencyService } from "./currency"

function createCurrency(): Currency {
  const currency = {} as Currency
  currency.status = "A"
  return currency
}
const fields = ["code", "symbol", "decimalDigits", "status"]
export class CurrencyController {
  constructor(private service: CurrencyService) {
    this.search = this.search.bind(this)
    this.view = this.view.bind(this)
    this.submit = this.submit.bind(this)
  }
  async search(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    let filter: CurrencyFilter = { limit: resources.defaultLimit }
    if (hasSearch(req)) {
      filter = fromRequest<CurrencyFilter>(req)
    }
    const { page, limit, sort } = filter
    const offset = getOffset(limit, page)
    try {
      const result = await this.service.search(filter, limit, page)
      const list = escapeArray(result.list, offset, "sequence")
      const search = getSearch(req.url)
      const permissions = res.locals.permissions as number
      const readonly = write != (write & permissions)
      render(req, res, "currencies", {
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
      const currency = createCurrency()
      render(req, res, "currency", {
        resource,
        editMode,
        currency: escape(currency),
      })
    } else {
      try {
        const currency = await this.service.load(id)
        if (!currency) {
          return renderError404(req, res, resource)
        }
        render(req, res, "currency", {
          resource,
          readonly,
          editMode,
          currency: escape(currency),
        })
      } catch (err) {
        renderError500(req, res, resource, err)
      }
    }
  }
  async submit(req: Request, res: Response) {
    const lang = getLang(req, res)
    const resource = getResource(lang)
    const currency = req.body
    const errors = validate<Currency>(currency, currencyModel, resource)
    if (errors.length > 0) {
      return respondError(res, errors)
    }
    const userId = res.locals.userId
    currency.updatedBy = userId
    const id = req.params.id
    const editMode = id !== "new"
    try {
      if (!editMode) {
        currency.createdBy = userId
        const result = await this.service.create(currency)
        const status = isSuccessful(result) ? 201 : 409
        res.status(status).json(result).end()
      } else {
        const result = await this.service.update(currency)
        const status = isSuccessful(result) ? 200 : 410
        res.status(status).json(result).end()
      }
    } catch (err) {
      handleError(err, res)
    }
  }
}
