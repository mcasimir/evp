'use strict';

var winston   = require('winston');
var flyWeight = {};
var inspect   = require('util').inspect;

var globalLogger = {
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

  getLoggerFor: function(component) {
    if (!flyWeight[component]) {
      flyWeight[component] = {
        log: function(level, message, metadata) {
          return globalLogger.log(level, `[${component}]  ${message}`, metadata);
        }
      };
    }
    return flyWeight[component];
  },

  log: function(level, message, metadata) {
    return globalLogger.log(level, message, metadata);
  }

};
