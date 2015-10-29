'use strict';

let Command             = require('../Command');
let JsonDsl             = require('../dsl/JsonDsl');
let expressions         = require('angular-expressions');
let evpParser           = new JsonDsl();

class If extends Command {

  constructor(config) {
    super(config);

    let branchConfig = evpParser.parsePair(config || {});

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
