'use strict';

var _ = require('lodash');
var waterfall = require('./utils/waterfall');

class Pipeline {

  constructor(commands) {
    this.commands = commands;
  }

  run(event){
    var fns = _.map(this.commands, function(command){
      return _.bind(command.run, command);
    });
    return waterfall(fns, event);
  }

}

module.exports = Pipeline;
