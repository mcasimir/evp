'use strict';

var EventMapper         = require('./EventMapper');
var Transform           = require('./commands/Transform');
var Forward             = require('./commands/Forward');
var Inspect             = require('./commands/Inspect');

EventMapper.registerCommand('transform', Transform);
EventMapper.registerCommand('forward', Forward);
EventMapper.registerCommand('inspect', Inspect);

module.exports = EventMapper;
