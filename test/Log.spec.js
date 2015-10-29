'use strict';

var Log     = require('../src/commands/Log');
var Logger  = require('../src/Logger');
var winston = Logger.getGlobalLogger().winston;

describe('Log', function() {

  describe('run', function() {

    it('should pass through the original event untouched', function(done) {
      var event = {
        a: {
          b: {
            c: 'OK'
          }
        }
      };

      var bkp = JSON.parse(JSON.stringify(event));

      var cmd = new Log();

      cmd.run(event).then(function(evt) {
        expect(evt).toEqual(bkp);
        done();
      });
    });

    it('should call winston.log', function(done) {
      spyOn(winston, 'log');

      var event = {
        a: {
          b: {
            c: 'OK'
          }
        }
      };

      var cmd = new Log();

      cmd.run(event).then(function() {
        expect(winston.log).toHaveBeenCalled();
        done();
      });
    });
  });

});
