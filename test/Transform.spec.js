'use strict';

let Transform = require('../src/commands/Transform');

describe('Transform', function() {

  describe('run', function() {
    it('should apply template and pass', function(done) {
      let event = {
        a: {
          b: {
            c: 'OK'
          }
        }
      };

      let transform = new Transform({ x: ['$.a.b.c'] });

      transform.run(event).then(function(evt) {
        expect(evt).toEqual({x: ['OK']});
        done();
      });
    });
  });

});
