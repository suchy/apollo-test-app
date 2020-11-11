/**
 * Alacrity's Apollo test application.
 *
 * A GraphQL + Apollo beast
 * https://github.com/alacrity-law/apollo-test-app
 *
 * Copyright © Alacrity Law Limited
 * All rights reserved.
 */
const util = require('util');

const BPromise = require('bluebird');
const log = require('logg').getLogger('app.boot');

const globals = require('./util/globals');
const logLib = require('./util/log-lib');
const appServices = require('./app-services');

/**
 * The master boot.
 *
 */
const app = module.exports = {};

// define stand alone status
globals.isStandAlone = require.main === module;

let initialized = false;

/**
 * Master bootstrap module.
 *
 * Available options to pass on the first arg:
 *
 * @param {Object=} optOpts init params.
 * @return {BPromise} A dissaster.
 */
app.init = BPromise.method(function (optOpts) {
  if (initialized) { return BPromise.resolve(); }
  initialized = true;

  // Initialize logging facilities
  logLib.init();

  if (process.env.NODE_NOLOG) {
    logLib.removeConsole();
  }

  log.info('Initializing... standAlone:', globals.isStandAlone,
    ':: System NODE_ENV:', process.env.NODE_ENV, ':: App Environment:', globals.env,
    ':: Server ID:', globals.serverId, ':: On Heroku:', globals.isHeroku);

  // Global exception handler
  process.on('uncaughtException', app.onNodeFail);

  return appServices.boot(optOpts)
    .catch(function (err) {
      log.error('Error on boot:', err);
      app.die(-1);
    });
});

/**
 * Catch-all for all unhandled exceptions
 *
 * @param {Error} err An error object.
 */
app.onNodeFail = function (err) {
  log.error('onNodeFail() :: Unhandled Exception. Error:', util.inspect(err), err);
  app.die(1);
};

/**
 * It's time to die...
 *
 * @param {number=} optExitCode optionally define an exit code.
 */
app.die = function (optExitCode) {
  let exitCode = 1;
  if (typeof optExitCode === 'number') {
    exitCode = optExitCode;
  }
  setTimeout(function () {
    process.exit(exitCode);
  }, 1000);
};

// ignition
if (globals.isStandAlone) {
  app.init();
}
