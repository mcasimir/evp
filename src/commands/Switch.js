'use strict';

var expressions         = require('angular-expressions');
var Command             = require('../Command');
var JsonDsl             = require('../dsl/JsonDsl');
var evpParser           = new JsonDsl();


class Switch extends Command {

  constructor(config) {
    super(config);
    this.tests = [];

    for (var k in config) {
      if (config.hasOwnProperty(k)) {
        this.tests.push({
          cond: expressions.compile('' + k),
          pipe: evpParser.parsePipeline(config[k])
        });
      }
    }
  }

  run(event){
    var promises = [];

    this.tests.forEach(function(test) {
      if (test.cond && test.cond({ $: event })) {
        promises.push(test.pipe.run(event));
      }
    });

    return Promise.all(promises);
  }

}

module.exports = Switch;
