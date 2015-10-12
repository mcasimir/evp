'use strict';

var Command = require('../src/Command');

describe('Command', function() {

  describe('extends', function() {
    it('creates a new command class', function() {
      var now = (new Date()).getTime();
      var fn = function() {
        return now;
      };

      var CmdClass = Command.extend({ run: fn });
      var cmd = new CmdClass();
      expect(cmd instanceof Command).toBe(true);

      expect(cmd.run()).toBe(now);
    });
  });

  describe('create', function() {
    it('creates a new command instance', function() {
      var now = (new Date()).getTime();
      var fn = function() {
        return now;
      };

      var cmd = Command.create({ run: fn });
      expect(cmd instanceof Command).toBe(true);
      expect(cmd.run()).toBe(now);
    });

    it('creates a new pass through instance if called without arguments', function() {
      var cmd = Command.create();
      var evt = { x: 5 };
      expect(cmd instanceof Command).toBe(true);
      expect(cmd.run(evt)).toBe(evt);
    });
  });


  describe('register', function() {
    beforeEach(function(){
      delete Command.registry;
    });

    it('registers a new command', function() {
      var fn = function() {};
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
      var fn = function() {};
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
      var conf = {x: 5};
      var internalConf;

      var Cmd = Command.extend({
        run: function() {
          internalConf = this.config;
        }
      });

      var cmd = new Cmd(conf);
      cmd.run();
      expect(internalConf).toBe(conf);
    });
  });


  describe('pipe', function() {
    it('wraps into promise if run returns plain object', function(done) {
      var obj = {x: 5};

      var cmd = Command.create({
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
      var obj = {x: 5};
      var prom = Promise.resolve(obj);

      var cmd = Command.create({
        run: function(){
          return prom;
        }
      });

      var pipeProm = cmd.pipe(true);
      expect(pipeProm === prom).toBe(true);
    });

    it('skips run if called with false', function() {
      var runned = false;

      var cmd = Command.create({
        run: function(){
          runned = true;
        }
      });

      cmd.pipe(false);
      expect(runned).toBe(false);
    });

    it('resolve to false if called with false', function() {
      var cmd = Command.create();

      cmd.pipe(false).then(function(res) {
        expect(res).toBe(false);
      });
    });
  });
});
