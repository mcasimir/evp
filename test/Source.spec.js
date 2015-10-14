'use strict';

let Source = require('../src/Source');

describe('Source', function() {

  beforeEach(function(){
    delete Source.registry;
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

  });

});
