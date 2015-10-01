'use strict';

var transform = require('jsonpath-object-transform');

var Command   = require('../Command');

class Transform extends Command {

  run(event){
    return Promise.resolve(transform(event, this.config));
  }

}

module.exports = Transform;
