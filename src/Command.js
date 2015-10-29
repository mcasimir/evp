'use strict';

var Logger        = require('./Logger');
var shortid       = require('shortid');

class Command {

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
    return class extends Command {
      constructor(config) {
        super(config);
        Object.assign(this, obj);
      }
    };
  }

  static createFromObj(obj, config) {
    obj = obj || {};
    return new (this.extend(obj))(config);
  }

  static createFromRegistry(name, config) {
    var Cls = this.get(name);
    if (Cls) {
      return new Cls(config, name);
    } else {
      return null;
    }
  }

  static create(typeOrObj, config) {
    if (typeof typeOrObj === 'string') {
      return this.createFromRegistry(typeOrObj, config);
    } else {
      return this.createFromObj(typeOrObj, config);
    }
  }

  constructor(config, name, id) {
    this.config = config || {};
    this.id         = id || shortid.generate();
    this.name       = name || this.constructor.name;
    this.uniqueName = [name, id].join('#');
    this.logger     = Logger.getLoggerFor(this.uniqueName);
    this.pipeline   = null;
  }

  log() {
    return this.logger.log.apply(this.logger, arguments);
  }

  setPipeline(pipeline) {
    this.pipeline = pipeline;
  }

  getPipeline() {
    return this.pipeline;
  }

  getSource() {
    return this.pipeline && this.pipeline.getSource();
  }

  /**
   * @abstract
   */
  run(event){
    return event;
  }

  pipe(event) {
    if (event === false) {
      return Promise.resolve(false);
    } else {
      try {
        let res = this.run(event);
        if (res instanceof Promise) {
          return res;
        } else {
          return Promise.resolve(res === false ? false : res || event);
        }
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }
}

module.exports = Command;
