'use strict';

let Command    = require('../src/Command');
let Source     = require('../src/Source');
let Pipeline   = require('../src/Pipeline');
let Logger     = require('../src/Logger');
let loggerImpl = Logger.getLogger();

describe('Command', function() {

  beforeEach(function() {
    this.commandRegistryBackup  = Object.assign({}, Command.registry);
    this.sourceRegistryBackup   = Object.assign({}, Source.registry);
  });

  afterEach(function() {
    Command.registry = this.commandRegistryBackup;
    Source.registry = this.soucreRegistryBackup;
  });

  describe('constructor', function(){
    it('sets configuration to {} as default', function() {
      expect((new Command()).config).toEqual({});
    });

    it('sets name after command constructor name by default', function(){
      expect((new Command()).name).toEqual('Command');
    });

    it('sets an id if none provided by default', function(){
      expect((new Command()).id).toBeTruthy();
    });
  });

  describe('extends', function() {
    it('creates a new command class', function() {
      let now = (new Date()).getTime();
      let fn = function() {
        return now;
      };

      let CommandClass = Command.extend({ run: fn });
      let cmd = new CommandClass();
      expect(cmd instanceof Command).toBe(true);

      expect(cmd.run()).toBe(now);
    });
  });

  describe('create', function() {
    beforeEach(function(){
      delete Command.registry;
    });

    it('creates a new command instance', function() {
      let now = (new Date()).getTime();
      let fn = function() {
        return now;
      };

      let cmd = Command.create({ run: fn });
      expect(cmd instanceof Command).toBe(true);
      expect(cmd.run()).toBe(now);
    });

    it('creates a new pass through instance if called without arguments', function() {
      let cmd = Command.create();
      let evt = { x: 5 };
      expect(cmd instanceof Command).toBe(true);
      expect(cmd.run(evt)).toBe(evt);
    });

    it('creates a registered command', function() {
      class Cmd extends Command {

      }
      Command.register('cmd', Cmd);
      let cmd = Command.create('cmd', {});
      expect(cmd instanceof Cmd).toBe(true);
    });

    it('does not create a command not registered', function() {
      let cmd = Command.create('cmd', {});
      expect(cmd).toBe(null);
    });
  });

  describe('register', function() {
    beforeEach(function(){
      delete Command.registry;
    });

    it('registers a new command', function() {
      let CommandClass = function() {};
      Command.register('newCommand', CommandClass);
      expect(Command.registry).toBeDefined();
      if (Command.registry) {
        expect(Command.registry.newCommand).toBe(CommandClass);
      }
    });
  });

  describe('get', function() {
    beforeEach(function(){
      delete Command.registry;
    });

    it('gets a registered command', function() {
      let fn = function() {};
      Command.register('newCommand', fn);
      expect(Command.get('newCommand')).toBe(fn);
    });

    it('does not throw and returns falsy on unregistered commands', function() {
      expect(function() {
        Command.get('newCommand');
      }).not.toThrow();

      expect(Command.get('newCommand')).toBeFalsy();
    });
  });

  describe('run', function() {
    it('should have access to configuration', function() {
      let conf = {x: 5};
      let internalConf;

      let Cmd = Command.extend({
        run: function() {
          internalConf = this.config;
        }
      });

      let cmd = new Cmd(conf);
      cmd.run();
      expect(internalConf).toBe(conf);
    });

    it('should be able to log', function () {
      spyOn(loggerImpl, 'log');

      let Cmd = Command.extend({
        run: function() {
          this.log('info', 'message');
        }
      });

      let cmd = new Cmd({});
      cmd.run();
      expect(loggerImpl.log).toHaveBeenCalled();
    });

    it('should log command path', function () {
      spyOn(loggerImpl, 'log');

      let Src = Source.extend({
        listen: function() {}
      });

      let src = new Src('src1', {});
      let pipeline = new Pipeline();
      let cmd = Command.create({
        run: function(){
          this.log('info', 'message');
        }
      });

      src.setPipeline(pipeline);

      pipeline.addCommand(cmd);

      cmd.run();
      let lastCall = loggerImpl.log.calls.first();
      expect(lastCall.args[1]).toMatch(/\[src1\.Pipeline#\d+\-\d+\.Command#\d+\-\d+\] message/);
    });
  });

  describe('pipe', function() {
    it('wraps into promise if run returns plain object', function(done) {
      let obj = {x: 5};

      let cmd = Command.create({
        run: function(){
          return obj;
        }
      });

      cmd.pipe(true).then(function(evt) {
        expect(evt).toBe(obj);
        done();
      });
    });

    it('returns the same promise if run returns a promise', function() {
      let obj = {x: 5};
      let prom = Promise.resolve(obj);

      let cmd = Command.create({
        run: function(){
          return prom;
        }
      });

      let pipeProm = cmd.pipe(true);
      expect(pipeProm === prom).toBe(true);
    });

    it('skips run if called with false', function() {
      let runned = false;

      let cmd = Command.create({
        run: function(){
          runned = true;
        }
      });

      cmd.pipe(false);
      expect(runned).toBe(false);
    });

    it('resolve to false if called with false', function() {
      let cmd = Command.create();

      cmd.pipe(false).then(function(res) {
        expect(res).toBe(false);
      });
    });
  });

  describe('getSource', function() {

    it('should retrieve a source once it is set', function() {
      let Src = Source.extend({
        listen: function() {}
      });

      let src = new Src('src', {});
      let pipeline = new Pipeline();
      let cmd = Command.create({
        run: function(){}
      });

      src.setPipeline(pipeline);

      pipeline.addCommand(cmd);

      expect(cmd.getSource()).toBe(src);
    });

    it('should return falsy if pipeline is not set', function() {
      let cmd = Command.create({
        run: function(){}
      });

      expect(cmd.getSource()).toBeFalsy();
    });

  });
});
