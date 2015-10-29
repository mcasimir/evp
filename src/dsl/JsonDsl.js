'use strict';

let _             = require('lodash');
let Command       = require('../Command');
let Source        = require('../Source');
let Pipeline      = require('../Pipeline');
let JsonDslError  = require('./JsonDslError');

class JsonDsl {
  constructor() {}

  parseCommand(def) {
    let pair = this.parsePair(def);
    let name = pair.key;
    let config = pair.value;

    let cmd = Command.create(name, config);

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
    let source = Source.create(definition.type, name, definition.config);
    if (!source) {
      throw new JsonDslError(`Unable to find an Source for type ${definition.type}`);
    }
    source.setPipeline(this.parsePipeline(definition.process));

    return source;
  }

  parsePair(obj) {
    obj = obj || {};
    let pair = _.pairs(obj)[0];
    if (pair) {
      return {
        key: pair[0],
        value: pair[1]
      };
    }
  }

  parse(tree) {
    let sources = {};
    tree = tree || {};
    _.each(tree, (sourceConf, sourceName) => {
      sources[sourceName] = this.parseSource(sourceName, sourceConf);
    });
    return sources;
  }
}

module.exports = JsonDsl;
