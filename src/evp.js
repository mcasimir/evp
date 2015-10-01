'use strict';

var EventMapper         = require('./EventMapper');
var Transform           = require('./commands/Transform');
var Forward             = require('./commands/Forward');
var Inspect             = require('./commands/Inspect');
var EventSource         = require('./EventSource');
var Command             = require('./Command');

EventMapper.registerCommand('transform', Transform);
EventMapper.registerCommand('forward', Forward);
EventMapper.registerCommand('inspect', Inspect);

var evp = new EventMapper();

evp.registerCommand = function(name, cmd) {
  return EventMapper.registerCommand(name, cmd);
};

evp.registerSource = function(name, src) {
  return EventMapper.registerSource(name, src);
};

evp.EventSource = EventSource;
evp.Command = Command;

module.exports = evp;
