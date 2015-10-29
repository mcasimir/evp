'use strict';

let Switch = require('../src/commands/Switch');
let Command = require('../src/Command');
let config = {
  '$.a': [
    { emit: 'A' }
  ],
  '$.b': [
    { emit: 'B' }
  ],
  '$.c': [
    { emit: 'C' }
  ]
};

describe('Switch', function() {

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

    it('should apply sub-pipelines depending on conditions 1', function(done) {

      let cmd = new Switch(config);

      cmd.run({a: true}).then(function(res) {
        expect(res).toEqual(['A']);
        done();
      });

    });

    it('should apply sub-pipelines depending on conditions 2', function(done) {

      let cmd = new Switch(config);

      cmd.run({b: true}).then(function(res) {
        expect(res).toEqual(['B']);
        done();
      });

    });

    it('should apply sub-pipelines depending on conditions 3', function(done) {

      let cmd = new Switch(config);

      cmd.run({c: true}).then(function(res) {
        expect(res).toEqual(['C']);
        done();
      });

    });

    it('should not apply sub-pipelines if all conditions fails', function(done) {

      let cmd = new Switch(config);

      cmd.run({d: true}).then(function(res) {
        expect(res).toEqual([]);
        done();
      });

    });
  });

});
