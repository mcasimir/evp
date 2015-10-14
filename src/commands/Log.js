'use strict';

var inspect = require('util').inspect;
var Command   = require('../Command');

class Log extends Command {

  run(event){
    var now    = (new Date());
    var prompt = this.config.prompt;
    var args = [];

    args.push(now.toISOString());

    if (prompt) {
      args.push(`[${prompt}]`);
    }

    args.push(inspect(event, { depth: this.config.depth }));

    this._log.apply(this, args);

    return Promise.resolve(event);
  }

  _log() {
    console.log.apply(console, arguments);
  }

}

module.exports = Log;
