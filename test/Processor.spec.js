'use strict';

let Source    = require('../src/Source');
let Command   = require('../src/Command');
let Processor = require('../src/Processor');

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

describe('processor', function() {

  beforeEach(function() {
    Source.register('dummySource', DummySource);
    Command.register('dummy', DummyCommand);
    Command.register('error', ErrorCommand);
    this.processor = new Processor();
  });

  it('should expose logger', function() {
    expect(this.processor.logger).toBeDefined();
  });

  describe('can be used very easily', function() {
    it('can hook up a source with a command', function(done) {
      this.processor.configure({
        dummySource: {
          type: 'dummySource',
          config: {},
          process: [
            {dummy: {}}
          ]
        }
      });

      this.processor.listen();

      this.processor.on('eventProcessed', (e) => {
        expect(e.source.name).toEqual('dummySource');
        expect(e.result.time).toBeDefined();
        done();
      });
    });

    it('notifies about an event failure', function(done) {
      this.processor.configure({
        dummySource: {
          type: 'dummySource',
          config: {},
          process: [
            {error: {}}
          ]
        }
      });

      this.processor.listen();

      this.processor.on('eventProcessingError', (e) => {
        expect(e.source.name).toEqual('dummySource');
        done();
      });
    });
  });

});
