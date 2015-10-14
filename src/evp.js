'use strict';

var EventMapper         = require('./EventMapper');
var Transform           = require('./commands/Transform');
var Forward             = require('./commands/Forward');
var Inspect             = require('./commands/Inspect');
var EventSource         = require('./EventSource');
var Command             = require('./Command');

Command.register('transform', Transform);
Command.register('forward', Forward);
Command.register('inspect', Inspect);

var evp = new EventMapper();

evp.registerCommand = function(name, cmd) {
  return Command.register(name, cmd);
};

evp.registerSource = function(name, src) {
  return EventSource.register(name, src);
};

evp.EventSource = EventSource;
evp.Command = Command;

module.exports = evp;
