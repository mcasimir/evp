'use strict';

var JsonDsl = require('../src/dsl/JsonDsl');
var JsonDslError = require('../src/dsl/JsonDslError');
var Command = require('../src/Command');
var Source = require('../src/Source');
var dsl;

describe('JsonDsl', function() {

  beforeEach(function() {
    dsl = new JsonDsl();
    delete Command.registry;
    delete Source.registry;
  });


  describe('parseCommand', function(){
    it('Returns a new command with a registered command', function() {
      var Cmd1 = class extends Command {};
      Command.register('cmd1', Cmd1);
      var parsed = dsl.parseCommand({cmd1: {}});
      expect(parsed instanceof Cmd1).toBe(true);
    });

    it('Throws parsing a command not registered', function() {
      var callParse = function() {
        dsl.parseCommand({cmd1: {}});
      };
      expect(callParse).toThrowError(JsonDslError);
    });

    it('Passes config to command created', function() {
      var Cmd1 = class extends Command {};
      Command.register('cmd1', Cmd1);
      var parsed = dsl.parseCommand({cmd1: { x: 5 }});
      expect(parsed.config.x).toBe(5);
    });
  });

  xdescribe('parsePipeline', function(){

  });

  describe('parseSource', function(){
    it('Returns a new source with a registered source', function() {
      var Src1 = class extends Source {};
      Source.register('src1', Src1);
      var parsed = dsl.parseSource('xyz', {type: 'src1'});
      expect(parsed instanceof Src1).toBe(true);
    });

    it('Throws parsing a source not registered', function() {
      var callParse = function() {
        dsl.parseSource('xyz', {type: 'src1'});
      };
      expect(callParse).toThrowError(JsonDslError);
    });

    it('Passes config to source created', function() {
      var Src1 = class extends Source {};
      Source.register('src1', Src1);
      var parsed = dsl.parseSource('xyz', {type: 'src1', config: { x: 5 }});
      expect(parsed.config.x).toBe(5);
    });

    it('Passes name to source created', function() {
      var Src1 = class extends Source {};
      Source.register('src1', Src1);
      var parsed = dsl.parseSource('xyz', {type: 'src1'});
      expect(parsed.name).toBe('xyz');
    });
  });

  describe('parsePair', function(){

  });

  xdescribe('parse', function(){

  });

});
