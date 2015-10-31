'use strict';

let Log        = require('../src/commands/Log');
let Logger     = require('../src/Logger');
let loggerImpl = Logger.getImpl();

describe('Log', function() {

  describe('run', function() {

    it('should pass through the original event untouched', function(done) {
      spyOn(loggerImpl, 'log'); // silence loggerImpl

      let event = {
        a: {
          b: {
            c: 'OK'
          }
        }
      };

      let bkp = JSON.parse(JSON.stringify(event));

      let cmd = new Log();

      cmd.run(event).then(function(evt) {
        expect(evt).toEqual(bkp);
        done();
      });
    });

    it('should call loggerImpl.log', function(done) {
      spyOn(loggerImpl, 'log');

      let event = {
        a: {
          b: {
            c: 'OK'
          }
        }
      };

      let cmd = new Log();

      cmd.run(event).then(function() {
        expect(loggerImpl.log).toHaveBeenCalled();
        done();
      });
    });

    it('should call loggerImpl.log with right level', function(done) {
      spyOn(loggerImpl, 'log');

      let event = {
        a: {
          b: {
            c: 'OK'
          }
        }
      };

      let cmd = new Log({
        level: 'error'
      });

      cmd.run(event).then(function() {
        let lastCall = loggerImpl.log.calls.first();
        expect(lastCall.args[0]).toBe('error');
        done();
      });
    });
  });

});
