'use strict';

var Command   = require('../Command');

class Log extends Command {

  run(event){
    var meta = { timestamp: (new Date()).toISOString() };

    if (!this.config.skipEvent) {
      meta.event = event;
    }

    this.log(this.config.level || 'info', `${this.config.prompt|| ''}`, meta);

    return Promise.resolve(event);
  }

}

module.exports = Log;
