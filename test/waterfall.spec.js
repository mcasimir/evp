'use strict';

var waterfall = require('../src/utils/waterfall');

describe('waterfall', function() {
  it('should run all the funcs in sequence', function(done) {

    var fn1 = function(x){
      return Promise.resolve(x + 1);
    };

    var fn2 = function(x){
      return Promise.resolve(x * 2);
    };

    waterfall([fn1, fn2], 10).then(function(res) {
      expect(res).toBe(22);
      done();
    });
  });
});
