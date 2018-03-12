/**
 * @fileOverview A hash containing global required environmental values.
 *
 */
const os = require('os');

const config = require('config');

const globals = module.exports = {};

/** @type {?Object} Application Boot options */
globals.bootOpts = null;

/**
 * The supported environments
 *
 * @enum {string}
 */
globals.Environments = {
  DEVELOPMENT: 'development',
  HEROKU: 'heroku',
  HEROKUDEV: 'heroku_dev',
  TESTING: 'testing',
};


/** @type {boolean} If application runs directly from shell, gets set on app */
globals.isStandAlone = true;

/** @type {string} a unique identifier string for this node process. */
globals.serverId = `${os.hostname()}-${process.pid}`;

/**
 * Returns the current environemnt based on shell enviornment variable NODE_ENV
 * defaults to development.
 *
 * @return {app.core.globals.Environments} One of the supported environments.
 */
globals.getEnvironment = function () {
  const env = process.env.NODE_ENV || globals.Environments.DEVELOPMENT;

  let currentEnv = globals.Environments.DEVELOPMENT;

  Object.keys(globals.Environments).forEach(function (envIter) {
    if (env === globals.Environments[envIter]) {
      currentEnv = env;
    }
  });

  return currentEnv;
};

/**
 * The current environment canonicalized based on supported envs.
 * @type {app.core.globals.Environments}
 */
globals.env = globals.getEnvironment();

/** @type {boolean} If we are on development environment */
globals.isDev = [
  globals.Environments.DEVELOPMENT,
].indexOf(globals.env) >= 0;

/** @type {boolean} Determines if we are on heroku. */
globals.isHeroku = false;
if ([
  globals.Environments.HEROKUDEV,
  globals.Environments.HEROKU,
].indexOf(globals.env) >= 0) {
  globals.isHeroku = true;
}

/** @type {Object} Global variables available to views */
globals.viewGlobals = {
  ga: config.ga,
  env: globals.env,
};
