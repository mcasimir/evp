'use strict';

var Discard = require('../src/commands/Discard');

describe('Discard', function() {

  describe('run', function() {
    it('should always return false', function(done) {
      var event = {
        a: {
          b: {
            c: 'OK'
          }
        }
      };

      var cmd = new Discard();

      cmd.run(event).then(function(evt) {
        expect(evt).toEqual(false);
        done();
      });
    });
  });

});
