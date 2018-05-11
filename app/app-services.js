/**
 * @fileOverview The services to boot.
 */
const fs = require('fs');

const BPromise = require('bluebird');
const __ = require('lodash');

const log = require('logg').getLogger('app.boot.services');

const expressService = require('./services/express.service');

/**
 * Boots all the services of the application.
 *
 */
const AppServices = module.exports = {};

/**
 * Starts all the application's required services.
 * Triggers after all databases are connected.
 *
 * @param {Object=} optOpts A set of options.
 * @return {BPromise} a promise.
 */
AppServices.boot = BPromise.method(function (optOpts) {
  log.info('initServices() :: Init...');

  let userOpts = {};
  if (__.isObject(optOpts)) {
    userOpts = optOpts;
  }

  /** @type {Object} define default options */
  const bootOpts = __.defaults(userOpts, {
    // launch webserver
    webserver: true,

    // log to console
    // Env: APP_NOLOG
    log: true,
  });

  const boot = [];

  if (bootOpts.webserver) {
    boot.push(expressService.init.bind(null, bootOpts));
  }

  // if run as root, downgrade to the owner of this file
  // quickfix for nodeJS on windows
  if (typeof process.getuid === 'function' && process.getuid() === 0) {
    fs.stat(__filename, function (err, stats) {
    // eslint-disable-next-line no-console
      if (err) { return console.error(err); }
      process.setuid(stats.uid);
    });
  }

  return BPromise.resolve(boot)
    .map(function (servicePromise) {
      return servicePromise();
    })
    .then(function () {
      log.info('initServices() :: Init finish.');
    });
});
