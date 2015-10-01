'use strict';

class Command {

  constructor(config) {
    this.config = config;
  }

  /**
   * @abstract
   */
  run(event){
    return Promise.resolve(event);
  }

}

module.exports = Command;
