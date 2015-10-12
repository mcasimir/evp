'use strict';

var EventSource = require('../src/EventSource');
var Command = require('../src/Command');
var EventMapper = require('../src/EventMapper');
var eventMapper = new EventMapper();

class DummyCommand extends Command {
  run(event){
    return Promise.resolve(event);
  }
}

class ErrorCommand extends Command {
  run(event){
    return Promise.reject(event);
  }
}

class DummySource extends EventSource {
  listen() {
    this.event({
      time: (new Date()).getTime()
    });
  }
}

describe('EventMapper', function() {

  beforeEach(() => {
    EventSource.register('dummySource', DummySource);
    Command.register('dummy', DummyCommand);
    Command.register('error', ErrorCommand);
  });

  describe('can be used very easily', function() {
    it('can hook up a source with a command', function(done) {
      eventMapper.configure({
        dummySource: {
          type: 'dummySource',
          config: {},
          process: {
            dummy: {}
          }
        }
      });

      eventMapper.listen();

      eventMapper.on('eventProcessed', (e) => {
        expect(e.source.name).toEqual('dummySource');
        expect(e.result.time).toBeDefined();
        done();
      });
    });

    it('notifies about an event failure', function(done) {
      eventMapper.configure({
        dummySource: {
          type: 'dummySource',
          config: {},
          process: {
            error: {}
          }
        }
      });

      eventMapper.listen();

      eventMapper.on('eventProcessingError', (e) => {
        expect(e.source.name).toEqual('dummySource');
        done();
      });
    });
  });

});
