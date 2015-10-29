'use strict';

let expressions         = require('angular-expressions');
let Command             = require('../Command');
let JsonDsl             = require('../dsl/JsonDsl');
let evpParser           = new JsonDsl();

class Switch extends Command {

  constructor(config) {
    super(config);
    this.tests = [];

    for (let k in config) {
      if (config.hasOwnProperty(k)) {
        this.tests.push({
          cond: expressions.compile('' + k),
          pipe: evpParser.parsePipeline(config[k])
        });
      }
    }
  }

  run(event){
    let promises = [];

    this.tests.forEach(function(test) {
      if (test.cond && test.cond({ $: event })) {
        promises.push(test.pipe.run(event));
      }
    });

    return Promise.all(promises);
  }

}

module.exports = Switch;
