'use strict';

var transform = require('../utils/jsonTransform');
var Command   = require('../Command');

class Transform extends Command {

  run(event){
    return Promise.resolve(transform(event, this.config));
  }

}

module.exports = Transform;
