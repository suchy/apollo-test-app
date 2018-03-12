/**
 * @fileOverview The core express instance, requires all others.
 */
const config = require('config');
const BPromise = require('bluebird');
const express = require('express');
const vhost = require('vhost');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const nodeonExpressError = require('nodeon-express-error');
const cors = require('cors');


const webService = require('../web.service');
const globals = require('../globals');

const log = require('logg').getLogger('app.service.express');

/**
 * The express module.
 *
 */
const expressService = module.exports = {};

/**
 * Kick off the webserver...
 *
 * @param {Object} opts Options as defined in app.init().
 * @return {BPromise} a promise.
 */
ExpressApp.prototype.init = BPromise.method(function (opts) {
  /** @type {express} The express instance */
  expressService.app = express();

  // initialize webserver
  webService.init(expressService.app);

  // remove x-powered-by header
  expressService.app.set('x-powered-by', false);

  // enable CORS for current development flow.
  expressService.app.use(corsMidd.allowCrossDomain.bind(corsMidd));

  // Discover proper port, Heroku exports it in an env
  let port;
  if (globals.isHeroku) {
    port = process.env.PORT;
  } else {
    port = config.webserver.port;
  }

  // Setup express
  expressService.app.set('port', port);
  // remove x-powered-by header
  expressService.app.set('x-powered-by', false);

  // Don't rate limit heroku
  expressService.app.enable('trust proxy');

  const corsOptions = {
    credentials: true
  };
  expressService.app.use(cors(corsOptions));

  expressService.app.use(bodyParser.urlencoded({ extended: true }));
  expressService.app.use(bodyParser.json());

  // Init websockets
  socketServer.init(webserver.http);
  // listen for websocket connections
  socketServer.listen(globals.WebsocketNamespace.WEBSITE);

  if (config.usevhosts) {
    socketServer.listen(globals.WebsocketNamespace.API);
    expressService.app.use(vhost(config.hostname.api, appApi));
    log.finer('init() :: Initialized vhost for hostname:', config.hostname.api);
  }

  // ultimate fallback if no vhost triggers, use main web app
  expressService.app.use(appWebserver);

  // nodeON Express Error Handler
  expressService.app.use(nodeonExpressError);

  return webserver.start(this.app);
});
});
