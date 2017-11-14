import dotenv from 'dotenv/config' // eslint-disable-line no-unused-vars
import Joi from 'joi'

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  SERVER_PORT: Joi.number().default(4040),
  MONGOOSE_DEBUG: Joi.boolean().when('NODE_ENV', {
    is: Joi.string().equal('development'),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false),
  }),
  JWT_SECRET: Joi.string()
    .required()
    .description('JWT Secret required to sign'),
  MONGO_HOST: Joi.string()
    .required()
    .description('Mongo DB host url'),
  MONGO_PORT: Joi.number().default(27017),
  LOG_LEVEL: Joi.string()
    .allow(['FATAL', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'])
    .when('NODE_ENV', {
      is: Joi.string().equal('production'),
      then: Joi.string().default('INFO'),
      otherwise: Joi.string().default('DEBUG'),
    }),
  SENTRY_DSN: Joi.string(),
})
  .unknown()
  .required()

const {error, value: envVars} = Joi.validate(process.env, envVarsSchema)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.SERVER_PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  logLevel: process.env.LOG_LEVEL,
  sentryDSN: process.env.SENTRY_DSN,
  jwtSecret: envVars.JWT_SECRET,
  mongo: {
    host: envVars.MONGO_HOST,
    port: envVars.MONGO_PORT,
  },
}

export default config
