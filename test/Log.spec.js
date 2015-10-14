'use strict';

var Log = require('../src/commands/Log');

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

    it('should call console.log', function(done) {
      spyOn(console, 'log');

      var event = {
        a: {
          b: {
            c: 'OK'
          }
        }
      };

      var cmd = new Log();

      cmd.run(event).then(function() {
        expect(console.log).toHaveBeenCalled();
        done();
      });
    });
  });

});
