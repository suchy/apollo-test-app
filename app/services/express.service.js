/**
 * @fileOverview The core express instance, requires all others.
 */
const BPromise = require('bluebird');
const express = require('express');
const bodyParser = require('body-parser');
const nodeonExpressError = require('nodeon-express-error');
const cors = require('cors');
const { graphqlExpress } = require('apollo-server-express');

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
expressService.prototype.init = BPromise.method(function () {
  /** @type {express} The express instance */
  expressService.app = express();

  // initialize webserver
  webService.init(expressService.app);

  // remove x-powered-by header
  expressService.app.set('x-powered-by', false);

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
    graphqlExpress({ schema: myGraphQLSchema }));

  // nodeON Express Error Handler
  expressService.app.use(nodeonExpressError);

  return webService.start(expressService.app);
});
