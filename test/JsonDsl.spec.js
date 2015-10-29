'use strict';

let JsonDsl = require('../src/dsl/JsonDsl');
let JsonDslError = require('../src/dsl/JsonDslError');
let Command = require('../src/Command');
let Source = require('../src/Source');
let dsl;

describe('JsonDsl', function() {

  beforeEach(function() {
    dsl = new JsonDsl();
    delete Command.registry;
    delete Source.registry;
  });

  describe('parseCommand', function(){
    it('Returns a new command with a registered command', function() {
      let Cmd1 = class extends Command {};
      Command.register('cmd1', Cmd1);
      let parsed = dsl.parseCommand({cmd1: {}});
      expect(parsed instanceof Cmd1).toBe(true);
    });

    it('Throws parsing a command not registered', function() {
      let callParse = function() {
        dsl.parseCommand({cmd1: {}});
      };
      expect(callParse).toThrowError(JsonDslError);
    });

    it('Passes config to command created', function() {
      let Cmd1 = class extends Command {};
      Command.register('cmd1', Cmd1);
      let parsed = dsl.parseCommand({cmd1: { x: 5 }});
      expect(parsed.config.x).toBe(5);
    });
  });

  describe('parsePipeline', function(){
    xit('todo', function(){});
  });

  describe('parseSource', function(){
    it('Returns a new source with a registered source', function() {
      let Src1 = class extends Source {};
      Source.register('src1', Src1);
      let parsed = dsl.parseSource('xyz', {type: 'src1'});
      expect(parsed instanceof Src1).toBe(true);
    });

    it('Throws parsing a source not registered', function() {
      let callParse = function() {
        dsl.parseSource('xyz', {type: 'src1'});
      };
      expect(callParse).toThrowError(JsonDslError);
    });

    it('Passes config to source created', function() {
      let Src1 = class extends Source {};
      Source.register('src1', Src1);
      let parsed = dsl.parseSource('xyz', {type: 'src1', config: { x: 5 }});
      expect(parsed.config.x).toBe(5);
    });

    it('Passes name to source created', function() {
      let Src1 = class extends Source {};
      Source.register('src1', Src1);
      let parsed = dsl.parseSource('xyz', {type: 'src1'});
      expect(parsed.name).toBe('xyz');
    });
  });

  describe('parsePair', function(){
    xit('todo', function(){});
  });

  describe('parse', function(){
    xit('todo', function(){});
  });

});
