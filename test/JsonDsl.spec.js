'use strict';

let JsonDsl = require('../src/dsl/JsonDsl');
let JsonDslError = require('../src/dsl/JsonDslError');
let Command = require('../src/Command');
let Pipeline = require('../src/Pipeline');
let Source = require('../src/Source');
let dsl;

describe('JsonDsl', function() {

  beforeEach(function() {
    this.commandRegistryBackup  = Object.assign({}, Command.registry);
    this.sourceRegistryBackup   = Object.assign({}, Source.registry);
    dsl = new JsonDsl();
    delete Command.registry;
    delete Source.registry;
  });

  afterEach(function() {
    Command.registry = this.commandRegistryBackup;
    Source.registry = this.soucreRegistryBackup;
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
    // parsePipeline(cmds) {
    //   if (_.isObject(cmds) && !Array.isArray(cmds)) {
    //     cmds = [cmds];
    //   } else if (!Array.isArray(cmds)) {
    //     cmds = [];
    //   }
    //
    //   return new Pipeline(cmds.map((cmdDef) => {
    //     return this.parseCommand(cmdDef);
    //   }));
    // }
    // xit('todo', function(){});

    it('should create a new empty pipeline with no arguments', function() {
      let pipeline = dsl.parsePipeline();
      expect(pipeline instanceof Pipeline).toBe(true);
      expect(pipeline.commands).toEqual([]);
    });

    it('should create a new empty pipeline with empty object', function() {
      let pipeline = dsl.parsePipeline({});
      expect(pipeline instanceof Pipeline).toBe(true);
      expect(pipeline.commands).toEqual([]);
    });

    it('should create a new empty pipeline with empty array', function() {
      let pipeline = dsl.parsePipeline([]);
      expect(pipeline instanceof Pipeline).toBe(true);
      expect(pipeline.commands).toEqual([]);
    });

    it('should create a new pipeline with one registered command from single command as object', function() {
      let Cmd1 = class extends Command {};
      Command.register('cmd1', Cmd1);

      let pipeline = dsl.parsePipeline({cmd1: { x: 5 }});

      expect(pipeline instanceof Pipeline).toBe(true);
      expect(pipeline.commands.length).toBe(1);
      expect(pipeline.commands[0] instanceof Cmd1).toBe(true);
      expect(pipeline.commands[0].config).toEqual({x: 5});
    });

    it('should create a new pipeline with one registered command from single command as array', function() {
      let Cmd1 = class extends Command {};
      Command.register('cmd1', Cmd1);

      let pipeline = dsl.parsePipeline([
        {cmd1: { x: 5 }}
      ]);

      expect(pipeline instanceof Pipeline).toBe(true);
      expect(pipeline.commands.length).toBe(1);
      expect(pipeline.commands[0] instanceof Cmd1).toBe(true);
      expect(pipeline.commands[0].config).toEqual({x: 5});
    });

    it('should create a new pipeline with many registered command from many command as object', function() {
      let Cmd1 = class extends Command {};
      Command.register('cmd1', Cmd1);
      let Cmd2 = class extends Command {};
      Command.register('cmd2', Cmd2);

      let pipeline = dsl.parsePipeline({
        cmd1: { x: 5 },
        cmd2: { y: 4 }
      });

      expect(pipeline instanceof Pipeline).toBe(true);
      expect(pipeline.commands.length).toBe(2);
      expect(pipeline.commands[0] instanceof Cmd1).toBe(true);
      expect(pipeline.commands[0].config).toEqual({x: 5});
      expect(pipeline.commands[1] instanceof Cmd2).toBe(true);
      expect(pipeline.commands[1].config).toEqual({y: 4});
    });

    it('should create a new pipeline with many registered command from many command as array', function() {
      let Cmd1 = class extends Command {};
      Command.register('cmd1', Cmd1);
      let Cmd2 = class extends Command {};
      Command.register('cmd2', Cmd2);

      let pipeline = dsl.parsePipeline([
        {cmd1: { x: 5 }},
        {cmd2: { y: 4 }}
      ]);

      expect(pipeline instanceof Pipeline).toBe(true);
      expect(pipeline.commands.length).toBe(2);
      expect(pipeline.commands[0] instanceof Cmd1).toBe(true);
      expect(pipeline.commands[0].config).toEqual({x: 5});
      expect(pipeline.commands[1] instanceof Cmd2).toBe(true);
      expect(pipeline.commands[1].config).toEqual({y: 4});
    });
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

    it('should parse an object with one key and one value', function(){
      expect(dsl.parsePair({
        x: 5
      })).toEqual({
        key: 'x',
        value: 5
      });
    });

    it('should pick first key for an object with more than one key and one value', function(){
      expect(dsl.parsePair({
        x: 5,
        y: 4
      })).toEqual({
        key: 'x',
        value: 5
      });
    });

  });

  describe('parse', function(){

    it('parses a configuration with one source', function(){
      let Src1 = class extends Source {};
      Source.register('src1', Src1);

      let parsed = dsl.parse({
        xyz: {
          type: 'src1'
        }
      });

      expect(parsed.xyz instanceof Src1).toBe(true);
    });

    it('parses a configuration with many sources', function(){
      let Src1 = class extends Source {};
      let Src2 = class extends Source {};

      Source.register('src1', Src1);
      Source.register('src2', Src2);

      let parsed = dsl.parse({
        xyz: {
          type: 'src1'
        },
        abc: {
          type: 'src2'
        }
      });

      expect(parsed.xyz instanceof Src1).toBe(true);
      expect(parsed.abc instanceof Src2).toBe(true);
    });

  });

});
