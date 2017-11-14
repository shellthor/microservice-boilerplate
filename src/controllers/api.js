import errors from 'restify-errors'
import {person} from '../services'
import logger from '../lib/logger'
import {send200, send201, send400, send500} from '../lib/rest-helper'

async function get(req, res, next) {
  let data
  try {
    data = await person.load(req.params.id)
    send200(res, next, data)
  } catch (err) {
    logger.error(err)
    send500(res, next, err)
  }
}

async function post(req, res, next) {
  let result
  try {
    res.setHeader('Content-Type', req.contentType())
    const data = {
      ...req.body,
    }
    result = await person.create(data)
    send201(res, next, result)
  } catch (err) {
    logger.error(err)
    send400(res, next, err)
  }
}

async function update(req, res, next) {
  let result
  try {
    res.setHeader('Content-Type', req.contentType())
    const data = {
      ...req.body,
    }
    result = await person.update(req.params.id, data)
    send201(res, next, result)
  } catch (err) {
    logger.error(err)
    send400(res, next, err)
  }
}

async function list(req, res, next) {
  let result
  try {
    result = await person.list()
    send200(res, next, result)
  } catch (err) {
    logger.error(err)
    send400(res, next, err)
  }
}

async function remove(req, res, next) {
  let result
  try {
    result = await person.remove(req.params.id)
    send200(res, next, result)
  } catch (err) {
    logger.error(err)
    send400(res, next, err)
  }
}

function error(req, res, next) {
  try {
    throw new errors.RestError('This is expected')
  } catch (err) {
    logger.error(err)
    send400(res, next, err)
  }
}

export default {get, post, error, list, update, remove}
