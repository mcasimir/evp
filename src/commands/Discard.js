'use strict';

var Command   = require('../Command');

class Discard extends Command {
  run(){
    return false;
  }
}

module.exports = Discard;
