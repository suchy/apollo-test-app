/**
 * @fileOverview The core express instance, requires all others.
 */
const path = require('path');


const BPromise = require('bluebird');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const log = require('logg').getLogger('app.service.express');

const {
  graphqlExpress,
  graphiqlExpress,
} = require('apollo-server-express');

// const graphqlHTTP = require('express-graphql');

const webService = require('./web.service');
const globals = require('../util/globals');
const myGraphQLSchema = require('../gql/schema');

/**
 * The express module.
 *
 */
const expressService = module.exports = {};

/**
 * Kick off the webserver...
 *
 * @return {BPromise} a promise.
 */
expressService.init = BPromise.method(function () {
  /** @type {express} The express instance */
  expressService.app = express();

  // initialize webserver
  webService.init(expressService.app);

  // remove x-powered-by header
  expressService.app.set('x-powered-by', false);

  // Use pug for templates
  expressService.app.engine('pug', require('pug').__express);
  expressService.app.set('views',
    path.join(__dirname, '/../../front/templates/'));
  expressService.app.set('view engine', 'pug');


  // enable CORS
  const corsOptions = {
    credentials: true,
  };
  expressService.app.use(cors(corsOptions));

  // Setup express
  expressService.app.set('port', globals.port);
  // remove x-powered-by header
  expressService.app.set('x-powered-by', false);

  // Don't rate limit heroku
  expressService.app.enable('trust proxy');

  // GraphQL
  expressService.app.use('/graphql', bodyParser.json(),
    graphqlExpress({
      schema: myGraphQLSchema.schema,
    }));

  expressService.app.use('/gqli', graphiqlExpress({
    endpointURL: '/graphql',
  }));

  // Express Error Handler
  expressService.app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    log.warn('Express Error Handler :: error:', err.message);
    if (!err.noStack) {
      log.warn('Stack of express error:', err.stack);
    }

    const httpCode = err.httpCode || 500;

    res.status(httpCode).json({ error: err.message });
  });

  return webService.start(expressService.app);
});
