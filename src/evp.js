'use strict';

var Processor           = require('./Processor');
var Source              = require('./Source');
var Command             = require('./Command');

var Discard             = require('./commands/Discard');
var Forward             = require('./commands/Forward');
var If                  = require('./commands/If');
var Log                 = require('./commands/Log');
var Switch              = require('./commands/Switch');
var Transform           = require('./commands/Transform');

Command.register('discard', Discard);
Command.register('forward', Forward);
Command.register('if', If);
Command.register('log', Log);
Command.register('switch', Switch);
Command.register('transform', Transform);

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
