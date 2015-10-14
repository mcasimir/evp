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

  static createFromObj(obj, name, config) {
    obj = obj || {};
    return new (this.extend(obj))(name, config);
  }

  static createFromRegistry(type, name, config) {
    var Cls = this.get(type);
    if (Cls) {
      return new Cls(name, config);
    } else {
      return null;
    }
  }

  static create(typeOrObj, name, config) {
    if (typeof typeOrObj === 'string') {
      return this.createFromRegistry(typeOrObj, name, config);
    } else {
      return this.createFromObj(typeOrObj, name, config);
    }
  }

  constructor(name, config) {
    super();
    this.name    = name;
    this.config  = config || {};
    this.pipelines = [];
  }

  event(event) {
    this.emit('event', event);

    var pipelinePromises = this.pipelines.map((pipeline) => {
      return pipeline.run(event)
        .then((result) => {
          this.emit('eventProcessed', {source: this, result: result});
          return result;
        })
        .catch((error) => {
          this.emit('eventProcessingError', {source: this, error: error});
          return error;
        });
    });

    return Promise.all(pipelinePromises);
  }

  /**
   * @abstract
   */
  listen() { }
}

module.exports = EventSource;
