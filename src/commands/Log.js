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

    console.log.apply(console, args);

    return Promise.resolve(event);
  }

}

module.exports = Log;
