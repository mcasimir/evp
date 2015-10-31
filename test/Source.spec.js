'use strict';

let Source     = require('../src/Source');
let Pipeline   = require('../src/Pipeline');
let Command    = require('../src/Command');
let Logger     = require('../src/Logger');
let loggerImpl = Logger.getImpl();

describe('Source', function() {

  beforeEach(function(){
    this.commandRegistryBackup  = Object.assign({}, Command.registry);
    this.sourceRegistryBackup   = Object.assign({}, Source.registry);
    delete Source.registry;
  });

  afterEach(function() {
    Command.registry = this.commandRegistryBackup;
    Source.registry = this.soucreRegistryBackup;
  });

  describe('extends', function() {

    it('creates a new source class', function() {
      let now = (new Date()).getTime();
      let fn = function() {
        return now;
      };

      let SrcClass = Source.extend({ listen: fn });
      let src = new SrcClass();
      expect(src instanceof Source).toBe(true);

      expect(src.listen()).toBe(now);
    });

  });

  describe('create', function() {

    it('creates a new source instance', function() {
      let now = (new Date()).getTime();
      let fn = function() {
        return now;
      };

      let src = Source.create({ listen: fn });
      expect(src instanceof Source).toBe(true);
      expect(src.listen()).toBe(now);
    });

    it('creates a registered source', function() {
      class Src extends Source {}
      Source.register('src', Src);
      let src = Source.create('src');
      expect(src instanceof Src).toBe(true);
    });

    it('does not create a source not registered', function() {
      let src = Source.create('src');
      expect(src).toBe(null);
    });

    it('always sets config to empty object if config is not passed', function() {
      class Src extends Source {}
      Source.register('src', Src);
      let src = Source.create('src');
      expect(src.config).toEqual({});
    });

    it('passes config to created instance', function() {
      class Src extends Source {}
      Source.register('src', Src);
      let src = Source.create('src', 'name', {x: 5});
      expect(src.config).toEqual({x: 5});
    });

    it('passes name to created instance', function() {
      class Src extends Source {}
      Source.register('src', Src);
      let src = Source.create('src', 'xyz', {x: 5});
      expect(src.name).toEqual('xyz');
    });
  });

  describe('register', function() {

    it('registers a new source', function() {
      let fn = function() {};
      Source.register('newSource', fn);
      expect(Source.registry).toBeDefined();
      if (Source.registry) {
        expect(Source.registry.newSource).toBe(fn);
      }
    });

  });

  describe('get', function() {

    it('gets a registered source', function() {
      let fn = function() {};
      Source.register('newSource', fn);
      expect(Source.get('newSource')).toBe(fn);
    });

    it('does not throw and returns falsy on unregistered sources', function() {
      expect(function() {
        Source.get('newSource');
      }).not.toThrow();

      expect(Source.get('newSource')).toBeFalsy();
    });

  });

  describe('setPipeline', function() {

    it('has to set itself as source for added pipeline', function() {
      let Src = Source.extend({
        listen: function() {}
      });

      let src = new Src('src', {});
      let pipeline = new Pipeline();

      src.setPipeline(pipeline);

      expect(pipeline.getSource()).toBe(src);
    });

  });

  describe('listen', function() {

    it('should have access to configuration', function() {
      let conf = {x: 5};
      let internalConf;

      let Src = Source.extend({
        listen: function() {
          internalConf = this.config;
        }
      });

      let src = new Src('src', conf);
      src.listen();
      expect(internalConf).toBe(conf);
    });

    it('should be able to log', function () {
      spyOn(loggerImpl, 'log');

      let Src = Source.extend({
        listen: function() {
          this.log('debug', 'message');
        }
      });

      let src = new Src('src', {});
      src.listen();
      expect(loggerImpl.log).toHaveBeenCalled();
    });

    it('should log prompting source name', function () {
      spyOn(loggerImpl, 'log');

      let Src = Source.extend({
        listen: function() {
          this.log('info', 'message');
        }
      });

      let src = new Src('src', {});
      src.listen();
      let lastCall = loggerImpl.log.calls.first();
      expect(lastCall.args[1]).toBe('[src] message');
    });

  });

  describe('event', function(){

    it('should catch if a command on a pipeline fails', function(done) {
      let Src = Source.extend({
        listen: function() {}
      });

      let src = new Src('src', {});
      let pipeline = new Pipeline();
      let err1  = new Error('This command will fail');
      let cmd = Command.create({
        run: function(){
          return Promise.reject(err1);
        }
      });

      src.setPipeline(pipeline);

      pipeline.addCommand(cmd);

      src.event({})
        .then(function() {
          expect(false).toBe('true', 'it should never get here');
        })
        .catch(function(err2){
          expect(err1).toBe(err2);
          done();
        });
    });

  });

});
