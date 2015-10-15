'use strict';

var Command             = require('../Command');
var JsonDsl             = require('../dsl/JsonDsl');
var expressions         = require('angular-expressions');
var evpParser           = new JsonDsl();

class If extends Command {

  constructor(config) {
    super(config);

    var branchConfig = evpParser.parsePair(config || {});

    if (branchConfig) {
      this.branch = {
        cond: expressions.compile('' + branchConfig.key),
        pipe: evpParser.parsePipeline(branchConfig.value)
      };
    }
  }

  run(event){
    if (this.branch && this.branch.cond) {

      if (this.branch.cond({ $: event })) {
        return this.branch.pipe.run(event);
      }
    }
    return Promise.resolve(event);
  }

}

module.exports = If;
