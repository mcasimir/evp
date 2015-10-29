'use strict';

let EventEmitter = require('events');
let Logger     = require('./Logger');
let Pipeline   = require('./Pipeline');

class Source extends EventEmitter {

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
    return class extends Source {
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
    let SourceClass = this.get(type);
    if (SourceClass) {
      return new SourceClass(name, config);
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
    this.name     = name;
    this.config   = config || {};
    this.logger   = Logger;
    this.pipeline = new Pipeline([], 'NullPipeline');
  }

  event(event) {
    this.emit('event', event);

    return this.pipeline.run(event)
      .then((result) => {
        this.emit('eventProcessed', {source: this, result: result});
        return result;
      })
      .catch((error) => {
        this.emit('eventProcessingError', {source: this, error: error});
        return Promise.reject(error);
      });
  }

  log(level, message, metadata) {
    return this.logger.logAs(this.name, level, message, metadata);
  }

  setPipeline(pipeline) {
    pipeline.setSource(this);
    this.pipeline = pipeline;
  }

  getPipeline() {
    return this.pipeline;
  }

  /**
   * @abstract
   */
  listen() { }
}

module.exports = Source;
