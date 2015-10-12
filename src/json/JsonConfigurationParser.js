'use strict';

var _ = require('lodash');
var Command = require('../Command');
var EventSource = require('../EventSource');
var Pipeline = require('../Pipeline');

class JsonConfigurationParser {
  constructor() {
  }

  parseCommand(def) {
    var name = Object.keys(def)[0];
    var config = def[name];

    for (var prop in config) {
      if (config.hasOwnProperty(prop)) {
        if (name.match(/!$/)) {
          var pipedef = config[prop];
          delete config[prop];
          config[name.replace(/!$/, '')] = this.parsePipeline(pipedef);
        }
      }
    }

    return Command.create(name, config);
  }

  parsePipeline(cmds) {
    if (!Array.isArray(cmds)) {
      cmds = [];
    }
    return new Pipeline(cmds.map((cmdDef) => {
      return this.parseCommand(cmdDef);
    }));
  }

  parseSource(name, definition) {
    var source = EventSource.create(definition.type, name, definition.config);
    if (!source) {
      throw new Error(`Unable to find an EventSource for type ${definition.type}`);
    }
    source.pipelines.push(this.parsePipeline(definition.process));
  }

  parse(tree) {
    var sources = {};
    tree = tree || {};
    _.each(tree, (sourceConf, sourceName) => {
      sources[sourceName] = this.parseSource(sourceName, sourceConf);
    });
    return sources;
  }
}

module.exports = JsonConfigurationParser;
