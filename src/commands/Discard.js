'use strict';

let Command   = require('../Command');

class Discard extends Command {
  run(){
    return Promise.resolve(false);
  }
}

module.exports = Discard;
