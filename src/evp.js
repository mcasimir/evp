'use strict';

var Processor           = require('./Processor');
var Transform           = require('./commands/Transform');
var Forward             = require('./commands/Forward');
var Log                 = require('./commands/Log');
var Source              = require('./Source');
var Command             = require('./Command');

Command.register('transform', Transform);
Command.register('forward', Forward);
Command.register('log', Log);

var evp = new Processor();

evp.registerCommand = function(name, cmd) {
  return Command.register(name, cmd);
};

evp.registerSource = function(name, src) {
  return Source.register(name, src);
};

evp.Source = Source;
evp.Command = Command;

module.exports = evp;
