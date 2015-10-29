'use strict';

let Pipeline = require('../src/Pipeline');
let Command = require('../src/Command');

describe('Pipeline', function() {
  let cmd1, cmd2, discard, runned;

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

  describe('constructor', function(){
    it('sets name after pipeline constructor name by default', function(){
      expect((new Pipeline()).name).toEqual('Pipeline');
    });

    it('sets an id if none provided by default', function(){
      expect((new Pipeline()).id).toBeTruthy();
    });

    it('has to setup itself as pipeline for commands', function() {
      let pipeline = new Pipeline([cmd1, cmd2]);
      expect(cmd1.getPipeline()).toBe(pipeline);
      expect(cmd2.getPipeline()).toBe(pipeline);
    });
  });

  describe('run', function() {
    it('should run internal commands in sequence', function(done) {
      let pipeline = new Pipeline([cmd1, cmd2]);
      pipeline.run({}).then(function() {
        expect(runned).toEqual(['cmd1', 'cmd2']);
        done();
      });
    });

    it('should discard commands after one command emits false', function(done) {
      let pipeline = new Pipeline([discard, cmd1, cmd2]);
      pipeline.run({}).then(function() {
        expect(runned).toEqual(['discard']);
        done();
      });
    });

    it('should run commands before one command emits false', function(done) {
      let pipeline = new Pipeline([cmd1, discard, cmd2]);
      pipeline.run({}).then(function() {
        expect(runned).toEqual(['cmd1', 'discard']);
        done();
      });
    });
  });

});
