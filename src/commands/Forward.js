'use strict';

var request   = require('request');
var _         = require('lodash');

var Command   = require('../Command');

class Forward extends Command {

  run(event){
    request(_.extend({ method: 'POST' }, this.config, { body: event, json: true }));
    return Promise.resolve(event);
  }

}

module.exports = Forward;
