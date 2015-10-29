'use strict';

let Processor           = require('./Processor');
let Source              = require('./Source');
let Command             = require('./Command');

let Discard             = require('./commands/Discard');
let Forward             = require('./commands/Forward');
let If                  = require('./commands/If');
let Log                 = require('./commands/Log');
let Switch              = require('./commands/Switch');
let Transform           = require('./commands/Transform');

Command.register('discard', Discard);
Command.register('forward', Forward);
Command.register('if', If);
Command.register('log', Log);
Command.register('switch', Switch);
Command.register('transform', Transform);

let evp = new Processor();

evp.registerCommand = function(name, cmd) {
  return Command.register(name, cmd);
};

evp.registerSource = function(name, src) {
  return Source.register(name, src);
};

evp.Source = Source;
evp.Command = Command;

module.exports = evp;
