'use strict';

var Pipeline = require('../src/Pipeline');
var Command = require('../src/Command');

describe('Pipeline', function() {
  var cmd1, cmd2, discard, runned;

  beforeEach(function() {
    runned = [];

    discard = Command.create({
      run: function() {
        runned.push('discard');
        return Promise.resolve(false);
      }});

    cmd1 = Command.create({
      run: function(evt) {
        runned.push('cmd1');
        return Promise.resolve(evt);
      }});

    cmd2 = Command.create(
      {run: function(evt) {
        runned.push('cmd2');
        return Promise.resolve(evt);
      }});
  });

  describe('run', function() {
    it('should run internal commands in sequence', function(done) {
      var pipeline = new Pipeline([cmd1, cmd2]);
      pipeline.run({}).then(function() {
        expect(runned).toEqual(['cmd1', 'cmd2']);
        done();
      });
    });

    it('should discard commands after one command emits false', function(done) {
      var pipeline = new Pipeline([discard, cmd1, cmd2]);
      pipeline.run({}).then(function() {
        expect(runned).toEqual(['discard']);
        done();
      });
    });

    it('should run commands before one command emits false', function(done) {
      var pipeline = new Pipeline([cmd1, discard, cmd2]);
      pipeline.run({}).then(function() {
        expect(runned).toEqual(['cmd1', 'discard']);
        done();
      });
    });
  });

});
