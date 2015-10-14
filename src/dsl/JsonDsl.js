'use strict';

var _ = require('lodash');
var Command = require('../Command');
var EventSource = require('../EventSource');
var Pipeline = require('../Pipeline');
var JsonDslError = require('./JsonDslError');

class JsonDsl {
  constructor() {
  }

  parseCommand(def) {
    var pair = this.parsePair(def);
    var name = pair.key;
    var config = pair.value;

    var cmd = Command.create(name, config);
    if (!cmd) {
      throw new JsonDslError(`Unable to find a Command for type ${name}`);
    }
    return cmd;
  }

  parsePipeline(cmds) {
    if (_.isObject(cmds) && !Array.isArray(cmds)) {
      cmds = [cmds];
    } else if (!Array.isArray(cmds)) {
      cmds = [];
    }

    return new Pipeline(cmds.map((cmdDef) => {
      return this.parseCommand(cmdDef);
    }));
  }

  parseSource(name, definition) {
    var source = EventSource.create(definition.type, name, definition.config);
    if (!source) {
      throw new JsonDslError(`Unable to find an EventSource for type ${definition.type}`);
    }
    source.pipelines.push(this.parsePipeline(definition.process));

    return source;
  }

  parsePair(obj) {
    obj = obj || {};
    var pair = _.pairs(obj)[0];
    if (pair) {
      return {
        key: pair[0],
        value: pair[1]
      };
    }
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

module.exports = JsonDsl;
