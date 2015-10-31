'use strict';

let DefaultLogger = require('./DefaultLogger');

class Logger {

  constructor(impl) {
    this.impl = impl || new DefaultLogger();
  }

  setImpl(impl) {
    this.impl = impl;
  }

  getImpl() {
    return this.impl;
  }

  log(level, message, meta) {
    return this.impl.log(level, message, meta);
  }

  logAs(component, level, message, metadata) {
    return this.impl.log(level, `[${component}] ${message}`.trim(), metadata);
  }

}

// The following will ensure 100% it is a sigleton.
// Otherwise `require('../Logger')` and `require('./Logger')` will cause
// node to cache 2 distinct modules and produce 2 different instances
// refering to separate internal state, thus causing implementation
// to be inconsistent.
global.__evp_logger_instance = global.__evp_logger_instance || new Logger();

module.exports = global.__evp_logger_instance;
