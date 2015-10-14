'use strict';

var If = require('../src/commands/If');
var Command = require('../src/Command');
var config = {
  '$.a': { emit: 'A' }
};

describe('If', function() {

  describe('run', function() {

    beforeEach(function() {
      Command.register('emit', Command.extend({
        run: function() {
          return this.config;
        }
      }));
    });

    it('should apply sub-pipelines if condition evaluates to true', function(done) {

      var cmd = new If(config);

      cmd.run({a: true}).then(function(res) {
        expect(res).toEqual('A');
        done();
      });

    });

    it('should apply sub-pipelines if condition evaluates to false', function(done) {

      var cmd = new If(config);

      cmd.run({x: 5}).then(function(res) {
        expect(res).toEqual({x: 5});
        done();
      });

    });

  });

});
