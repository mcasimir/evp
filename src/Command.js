'use strict';

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
      return new Cls(config);
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

  constructor(config) {
    this.config = config;
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
