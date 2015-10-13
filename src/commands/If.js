'use strict';

var jsonPath  = require('JSONPath');
var Command   = require('../Command');
var JsonConfigurationParser  = require('../json/JsonConfigurationParser');

class If extends Command {
  constructor(config) {
    super(config);
    var parser = new JsonConfigurationParser();

    var branchConfig = parser.parsePair(config || {});

    if (branchConfig) {
      this.branch = {
        cond: '' + branchConfig.key,
        pipe: parser.parsePipeline(branchConfig.value)
      };
    }
  }

  run(event){
    if (this.branch && this.branch.cond) {
      var cond = jsonPath.eval(event, this.branch.cond);
      if (cond && cond.length) {
        return this.branch.pipe.run(event);
      }
    }
    return Promise.resolve(event);
  }

}

module.exports = If;
