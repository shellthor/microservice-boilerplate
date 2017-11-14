import restify from 'restify'
import corsMiddleware from 'restify-cors-middleware'
import helmet from 'helmet'
import pkg from '../package'
import logger from './lib/logger'
import Config from './lib/config'
import {version, ping, echo, api} from './controllers'

/**
 * Returns a server with all routes defined on it
 */

const server = restify.createServer({
  name: pkg.name,
  version: '1.0.0',
  log: logger.child({
    component: 'server',
  }),
})

const cors = corsMiddleware({
  origins: ['*'],
})

server.pre(cors.preflight)

// Ensure we don't drop data on uploads
server.pre(restify.pre.pause())

// Clean up sloppy paths like //user//////1//
server.pre(restify.pre.sanitizePath())

// Handles annoying user agents (curl)
server.pre(restify.pre.userAgentConnection())

// Set a per request bunyan logger (with requestid filled in)
server.use(restify.plugins.requestLogger())

if (Config.throttle) {
  // Allow 10 requests/second by IP, and burst to 25
  server.use(
    restify.throttle({
      burst: 25,
      rate: 10,
      ip: true,
    }),
  )
}

// Use the common stuff you probably want
server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.authorizationParser())
server.use(cors.actual)
server.use(helmet())
server.use(restify.plugins.dateParser())
server.use(restify.plugins.queryParser())
server.use(restify.plugins.gzipResponse())
server.use(restify.plugins.bodyParser())
server.use(restify.plugins.fullResponse())

// Some standard handlers
server.get('/version', version.get)
server.get('/ping', ping.get)
server.get('/echo/:name', echo.get)
server.post('/echo', echo.post)
server.get('/api', api.list)
server.get('/api/:id', api.get)
server.post('/api', api.post)
server.put('/api/:id', api.update)
server.del('/api/:id', api.remove)
server.get('/throw', api.error)

server.on(
  'after',
  restify.plugins.auditLogger({
    event: 'after',
    log: logger.child({
      component: 'audit',
    }),
    server,
    printLog: true,
  }),
)

server.on('uncaughtException', (req, res, route, err) => {
  logger.error(err)
  res.send(new restify.InternalError(err, err.message || 'unexpected error'))
  return true
})

export default server
