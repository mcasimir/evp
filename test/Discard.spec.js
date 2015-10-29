'use strict';

let Discard = require('../src/commands/Discard');

describe('Discard', function() {

  describe('run', function() {
    it('should always return false', function(done) {
      let event = {
        a: {
          b: {
            c: 'OK'
          }
        }
      };

      let cmd = new Discard();

      cmd.run(event).then(function(evt) {
        expect(evt).toEqual(false);
        done();
      });
    });
  });

});
