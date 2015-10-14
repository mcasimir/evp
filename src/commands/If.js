'use strict';

var jsonPath  = require('../utils/jsonPath');
var Command   = require('../Command');
var JsonDsl  = require('../dsl/JsonDsl');

class If extends Command {
  constructor(config) {
    super(config);
    var parser = new JsonDsl();

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
      var cond = jsonPath(event, this.branch.cond);
      if (cond && cond.length) {
        return this.branch.pipe.run(event);
      }
    }
    return Promise.resolve(event);
  }

}

module.exports = If;
