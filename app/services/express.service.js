/**
 * @fileOverview The core express instance, requires all others.
 */
const path = require('path');

const { ApolloServer } = require('apollo-server-express');
const BPromise = require('bluebird');
const express = require('express');
const cors = require('cors');
const log = require('logg').getLogger('app.service.express');

const webService = require('./web.service');
const globals = require('../util/globals');
const myGraphQLSchema = require('../gql/schema');

const expressService = module.exports = {};

/**
 * Kick off the webserver...
 *
 * @return {BPromise} a promise.
 */
expressService.init = BPromise.method(function () {
  expressService.app = express();

  webService.init(expressService.app);

  expressService.app.engine('pug', require('pug').__express);
  expressService.app.set('views', path.join(__dirname, '/../../front/templates/'));
  expressService.app.set('view engine', 'pug');

  const corsOptions = {
    credentials: true,
  };
  expressService.app.use(cors(corsOptions));

  expressService.app.set('port', globals.port);
  expressService.app.set('x-powered-by', false);

  // Don't rate limit heroku
  expressService.app.enable('trust proxy');

  // GraphQL
  const server = new ApolloServer({
    schema: myGraphQLSchema.schema,
    introspection: true,
    playground: true,
  });
  server.applyMiddleware({ app: expressService.app, bodyParserConfig: true, path: '/graphql' });

  // Express Error Handler
  // eslint-disable-next-line no-unused-vars
  expressService.app.use((err, req, res, next) => {
    log.warn('Express Error Handler :: error:', err.message);
    if (!err.noStack) {
      log.warn('Stack of express error:', err.stack);
    }

    const httpCode = err.httpCode || 500;

    res.status(httpCode).json({ error: err.message });
  });

  return webService.start(expressService.app);
});
