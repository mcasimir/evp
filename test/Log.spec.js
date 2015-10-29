'use strict';

let Log     = require('../src/commands/Log');
let Logger  = require('../src/Logger');
let winston = Logger.getGlobalLogger().winston;

describe('Log', function() {

  describe('run', function() {

    it('should pass through the original event untouched', function(done) {
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

    it('should call winston.log', function(done) {
      spyOn(winston, 'log');

      let event = {
        a: {
          b: {
            c: 'OK'
          }
        }
      };

      let cmd = new Log();

      cmd.run(event).then(function() {
        expect(winston.log).toHaveBeenCalled();
        done();
      });
    });

    it('should call winston.log with right level', function(done) {
      spyOn(winston, 'log');

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
        let lastCall = winston.log.calls.first();
        expect(lastCall.args[0]).toBe('error');
        done();
      });
    });
  });

});
