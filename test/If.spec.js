'use strict';

let If = require('../src/commands/If');
let Command = require('../src/Command');
let config = {
  '$.a': { emit: 'A' }
};

describe('If', function() {

  beforeEach(function() {
    this.commandRegistryBackup  = Object.assign({}, Command.registry);

    Command.register('emit', Command.extend({
      run: function() {
        return this.config;
      }
    }));
  });

  afterEach(function() {
    Command.registry = this.commandRegistryBackup;
  });

  describe('run', function() {

    it('should apply sub-pipelines if condition evaluates to true', function(done) {

      let cmd = new If(config);

      cmd.run({a: true}).then(function(res) {
        expect(res).toEqual('A');
        done();
      });

    });

    it('should apply sub-pipelines if condition evaluates to false', function(done) {

      let cmd = new If(config);

      cmd.run({x: 5}).then(function(res) {
        expect(res).toEqual({x: 5});
        done();
      });

    });

  });

});
