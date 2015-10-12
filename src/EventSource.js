'use strict';

var EventEmitter = require('events');

class EventSource extends EventEmitter {

  static _registryGetSet(name, value) {
    this.registry = this.registry || {};
    if (value) {
      this.registry[name] = value;
    }
    return this.registry[name];
  }

  static register(name, subclass) {
    return this._registryGetSet(name, subclass);
  }

  static get(name) {
    return this._registryGetSet(name);
  }

  static extend(obj) {
    return class extends EventSource {
      constructor(name, config) {
        super(name, config);
        Object.assign(this, obj);
      }
    };
  }

  static create(obj) {
    return new (this.extend(obj))();
  }

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
