'use strict';

let Command = require('../src/Command');

describe('Command', function() {

  describe('extends', function() {
    it('creates a new command class', function() {
      let now = (new Date()).getTime();
      let fn = function() {
        return now;
      };

      let CmdClass = Command.extend({ run: fn });
      let cmd = new CmdClass();
      expect(cmd instanceof Command).toBe(true);

      expect(cmd.run()).toBe(now);
    });
  });

  describe('create', function() {
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
  });


  describe('register', function() {
    beforeEach(function(){
      delete Command.registry;
    });

    it('registers a new command', function() {
      let fn = function() {};
      Command.register('newCommand', fn);
      expect(Command.registry).toBeDefined();
      if (Command.registry) {
        expect(Command.registry.newCommand).toBe(fn);
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

  describe('instantiate', function() {
    it('creates a registered command', function() {
      class Cmd extends Command {

      }
      Command.register('cmd', Cmd);
      let cmd = Command.instantiate('cmd', {});
      expect(cmd instanceof Cmd).toBe(true);
    });

    it('creates a registered command', function() {
      let cmd = Command.instantiate('cmd', {});
      expect(cmd).toBe(null);
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
});
