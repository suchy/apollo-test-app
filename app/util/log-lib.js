/**
 * @fileOverview Logging facilities, logfiles.
 */
const { EventEmitter } = require('events');
const util = require('util');

const logg = require('logg');
const config = require('config');

let initialized = false;

const logger = module.exports = new EventEmitter();

/**
 * Initialize
 */
logger.init = function () {
  if (initialized) { return; }
  initialized = true;

  logger.setLevel();

  // intercept log messages before they reach the console
  logg.removeConsole();
  logg.rootLogger.registerWatcher(logger.interceptLogMessages);

  if (config.logger.console) {
    logg.addConsole();
  }

  // hook on logger
  try {
    logg.on('', logger._handleLog);
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.error('Logger failed:', util.inspect(ex));
  }

  const log = logg.getLogger('app.util.logger');

  if (!Array.isArray(config.logger.exceptions)) {
    log.fine('No logging exceptions found');
    return;
  }
  config.logger.exceptions.forEach(function (exception) {
    exception.namespaces.forEach(function (nsObj) {
      const nslogger = logg.getLogger(nsObj.ns);
      nslogger.setLogLevel(exception.level);
    });
  });
};

/**
 * set the minimum logging level to logg.
 *
 */
logger.setLevel = function () {
  const rootLogger = logg.getLogger(config.logger.prefix);
  rootLogger.setLogLevel(config.logger.level);
};

/**
 * Handle a captured log event.
 *
 * Sample logRecord object:
 *
 * level: 100
 * name: 'app.ctrl.process'
 * rawArgs: [ '_masterLoop() :: Loop: 2 processing: 0 concurrent jobs: 1' ]
 * date: Tue Apr 16 2013 18:29:52 GMT+0300 (EEST)
 * message: '_masterLoop() :: Loop: 2 processing: 0 concurrent jobs: 1' }
 *
 *
 * @param  {Object} logRecord As seen above.
 * @private
 */
logger._handleLog = function (logRecord) {
  // log level check.
  if (config.logger.level > logRecord.level) {
    return;
  }

  // relay the record
  logger.emit('message', logRecord);

  const message = logg.formatRecord(logRecord, true);

  if (config.logger.file) {
    logger._saveToFile(message);
  }
};

/**
 * Intercepts and reformats log messages if they contain an instance of Error.
 *
 * @param {Object} logRecord The Log Record.
 */
logger.interceptLogMessages = function (logRecord) {
  const errorStacks = [];
  let foundErrors = false;
  logRecord.rawArgs.forEach(function (arg, index) {
    if (logger.isError(arg)) {
      errorStacks.push(arg.stack);
      logRecord.rawArgs[index] = arg.message;
      foundErrors = true;
    }
  });

  if (foundErrors) {
    const log = logg.getLogger(logRecord.name);
    errorStacks.forEach(function (stack) {
      log.finest('Error Stack for:', logRecord.rawArgs[0], ':', stack);
    });
  }

  logRecord.message = logRecord.getFormattedMessage();
};

// Special treatment for objects that may look like errors.
logger.isError = function (o) {
  // eslint-disable-next-line no-mixed-operators
  return o && typeof o === 'object' && (o instanceof Error || o.message && o.stack);
};
