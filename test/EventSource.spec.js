'use strict';

let EventSource = require('../src/EventSource');

describe('EventSource', function() {

  describe('extends', function() {
    it('creates a new source class', function() {
      let now = (new Date()).getTime();
      let fn = function() {
        return now;
      };

      let SrcClass = EventSource.extend({ listen: fn });
      let src = new SrcClass();
      expect(src instanceof EventSource).toBe(true);

      expect(src.listen()).toBe(now);
    });
  });

  describe('create', function() {
    beforeEach(function(){
      delete EventSource.registry;
    });

    it('creates a new source instance', function() {
      let now = (new Date()).getTime();
      let fn = function() {
        return now;
      };

      let src = EventSource.create({ listen: fn });
      expect(src instanceof EventSource).toBe(true);
      expect(src.listen()).toBe(now);
    });

    it('creates a registered source', function() {
      class Src extends EventSource {

      }
      EventSource.register('src', Src);
      let src = EventSource.create('src', {});
      expect(src instanceof Src).toBe(true);
    });

    it('does not create a source not registered', function() {
      let src = EventSource.create('src', {});
      expect(src).toBe(null);
    });
  });

  describe('register', function() {
    beforeEach(function(){
      delete EventSource.registry;
    });

    it('registers a new source', function() {
      let fn = function() {};
      EventSource.register('newEventSource', fn);
      expect(EventSource.registry).toBeDefined();
      if (EventSource.registry) {
        expect(EventSource.registry.newEventSource).toBe(fn);
      }
    });
  });

  describe('get', function() {
    beforeEach(function(){
      delete EventSource.registry;
    });

    it('gets a registered source', function() {
      let fn = function() {};
      EventSource.register('newEventSource', fn);
      expect(EventSource.get('newEventSource')).toBe(fn);
    });

    it('does not throw and returns falsy on unregistered sources', function() {
      expect(function() {
        EventSource.get('newEventSource');
      }).not.toThrow();

      expect(EventSource.get('newEventSource')).toBeFalsy();
    });
  });

  describe('listen', function() {
    it('should have access to configuration', function() {
      let conf = {x: 5};
      let internalConf;

      let Src = EventSource.extend({
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