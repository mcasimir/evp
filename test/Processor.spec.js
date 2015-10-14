'use strict';

var Source = require('../src/Source');
var Command = require('../src/Command');
var Processor = require('../src/Processor');
var Processor = new Processor();

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

class DummySource extends Source {
  listen() {
    this.event({
      time: (new Date()).getTime()
    });
  }
}

describe('Processor', function() {

  beforeEach(() => {
    Source.register('dummySource', DummySource);
    Command.register('dummy', DummyCommand);
    Command.register('error', ErrorCommand);
  });

  describe('can be used very easily', function() {
    it('can hook up a source with a command', function(done) {
      Processor.configure({
        dummySource: {
          type: 'dummySource',
          config: {},
          process: [
            {dummy: {}}
          ]
        }
      });

      Processor.listen();

      Processor.on('eventProcessed', (e) => {
        expect(e.source.name).toEqual('dummySource');
        expect(e.result.time).toBeDefined();
        done();
      });
    });

    it('notifies about an event failure', function(done) {
      Processor.configure({
        dummySource: {
          type: 'dummySource',
          config: {},
          process: [
            {error: {}}
          ]
        }
      });

      Processor.listen();

      Processor.on('eventProcessingError', (e) => {
        expect(e.source.name).toEqual('dummySource');
        done();
      });
    });
  });

});
