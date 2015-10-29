'use strict';

let Logger        = require('./Logger');
let generateId    = require('./utils/generateId');

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
    let CommandClass = this.get(name);
    if (CommandClass) {
      return new CommandClass(config, name);
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
    this.id         = id || generateId();
    this.name       = name || this.constructor.name || 'Command';
    this.uniqueName = `${this.name}#${this.id}`;
    this.logger     = Logger;
    this.pipeline   = null;
  }

  log(level, message, metadata) {
    return this.logger.logAs(this.getLogPrompt(), level, message, metadata);
  }

  getLogPrompt() {
    let pipeline = this.getPipeline();
    let source   = this.getSource();
    return [ source && source.name,  pipeline && pipeline.uniqueName, this.uniqueName ].filter(function(segment) {
      return segment;
    }).join('.');
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

  getSourceName() {
    let src = this.getSource();
    return src && src.name;
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
