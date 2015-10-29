'use strict';

let waterfall = require('../src/utils/waterfall');

describe('waterfall', function() {
  it('should run all the funcs in sequence', function(done) {

    let fn1 = function(x){
      return Promise.resolve(x + 1);
    };

    let fn2 = function(x){
      return Promise.resolve(x * 2);
    };

    waterfall([fn1, fn2], 10).then(function(res) {
      expect(res).toBe(22);
      done();
    });
  });
});
