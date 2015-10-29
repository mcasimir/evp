'use strict';

let _             = require('lodash');
let waterfall     = require('./utils/waterfall');
let generateId    = require('./utils/generateId');
let Logger        = require('./Logger');

class Pipeline {

  constructor(commands, name, id) {
    this.id         = id || generateId();
    this.name       = name || this.constructor.name || 'Pipeline';
    this.uniqueName = `${this.name}#${this.id}`;
    this.logger     = Logger;
    this.source     = null;
    this.commands   = [];
    (commands || []).forEach((command) => {
      this.addCommand(command);
    });
  }

  log(level, message, metadata) {
    return this.logger.logAs(this.getLogPrompt(), level, message, metadata);
  }

  getLogPrompt() {
    let source   = this.getSource();
    return [ source && source.name, this.uniqueName ].filter(function(segment) {
      return segment;
    }).join('.');
  }

  addCommand(command) {
    command.setPipeline(this);
    this.commands.push(command);
  }

  run(event){
    let fns = _.map(this.commands, function(command){
      return _.bind(command.pipe, command);
    });
    return waterfall(fns, event);
  }

  setSource(source) {
    this.source = source;
  }

  getSource() {
    return this.source;
  }
}

module.exports = Pipeline;
