'use strict';

var EventEmitter = require('events');

class EventSource extends EventEmitter {
  constructor(name, config) {
    super();
    this.name    = name;
    this.config  = config;
  }

  /**
   * @abstract
   */
  listen() { }

  event(obj) {
    this.emit('event', obj);
  }
}

module.exports = EventSource;
