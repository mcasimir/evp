'use strict';

let winston   = require('winston');
let inspect   = require('util').inspect;

let globalLogger = {
  winston: winston,
  log: function(level, message, metadata) {
    message = typeof message === 'string' ? message : inspect(message, { depth: null });
    return this.winston.log(level, message, metadata);
  }
};

module.exports = {

  getGlobalLogger: function() {
    return globalLogger;
  },

  log: function(level, message, metadata) {
    return globalLogger.log(level, message, metadata);
  },

  logAs: function(component, level, message, metadata) {
    return globalLogger.log(level, `[${component}] ${message}`.trim(), metadata);
  }

};
