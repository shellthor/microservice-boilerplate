import util from 'util'
import Promise from 'bluebird'
import mongoose from 'mongoose'
import Config from './config'
import logger from './logger'

mongoose.Promise = Promise

const mongoUri = Config.mongo.host

async function connect() {
  await mongoose.connect(mongoUri, {
    keepAlive: 1,
    useMongoClient: true,
    promiseLibrary: Promise,
    poolSize: 10,
  })
  mongoose.connection.on('error', () => {
    throw Error(`unable to connect to database: ${mongoUri}`)
  })

  // print mongoose logs in dev env
  if (Config.MONGOOSE_DEBUG) {
    mongoose.set('debug', (collectionName, method, query, doc) => {
      logger.debug(
        `${collectionName}.${method}`,
        util.inspect(query, false, 20, true),
        doc,
      )
    })
  }
  logger.info(`connected to database: ${mongoUri}`)
}

export default {connect}
