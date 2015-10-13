'use strict';

var jsonPath  = require('JSONPath');
var Command   = require('../Command');
var JsonDsl  = require('../dsl/JsonDsl');

class Switch extends Command {

  constructor(config) {
    super(config);
    var parser = new JsonDsl();

    this.tests = [];

    for (var k in config) {
      if (config.hasOwnProperty(k)) {
        this.tests.push({
          cond: '' + k,
          pipe: parser.parsePipeline(config[k])
        });
      }
    }
  }

  run(event){
    var promises = [];

    this.tests.forEach(function(test) {
      var cond = jsonPath.eval(event, test.cond);
      if (cond && cond.length) {
        promises.push(test.pipe.run(event));
      }
    });

    return Promise.all(promises);
  }

}

module.exports = Switch;
