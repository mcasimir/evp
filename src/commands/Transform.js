'use strict';

let transform = require('../utils/jsonTransform');
let Command   = require('../Command');

class Transform extends Command {

  run(event){
    return Promise.resolve(transform(event, this.config));
  }

}

module.exports = Transform;
