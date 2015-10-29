'use strict';

var _ = require('lodash');
var waterfall = require('./utils/waterfall');
var shortid = require('shortid');
var Logger  = require('./Logger');

class Pipeline {

  constructor(commands, name, id) {
    this.id         = id || shortid.generate();
    this.name       = name || this.constructor.name;
    this.uniqueName = [name, id].join('#');
    this.logger     = Logger.getLoggerFor(this.uniqueName);
    this.source     = null;
    this.commands   = [];
    commands.forEach((command) => {
      this.addCommand(command);
    });
  }

  log() {
    return this.logger.log.apply(this.logger, arguments);
  }

  addCommand(command) {
    command.setPipeline(this);
    this.commands.push(command);
  }

  run(event){
    var fns = _.map(this.commands, function(command){
      return _.bind(command.pipe, command);
    });
    return waterfall(fns, event);
  }

  setSource(source) {
    this.source = source;
  }

}

module.exports = Pipeline;
