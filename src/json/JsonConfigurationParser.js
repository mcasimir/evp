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

    var cmd = Command.create(name, config);
    if (!cmd) {
      throw new Error(`Unable to find an Command for type ${name}`);
    }
    return cmd;
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

    return source;
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
