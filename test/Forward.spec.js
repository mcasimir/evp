'use strict';

let nock = require('nock');
let Forward = require('../src/commands/Forward');

describe('Forward', function() {

  describe('run', function() {
    it('should issue a POST http call passing stringifyied event as body', function(done) {

      let event = {
        a: 1,
        b: 2
      };

      nock('http://test.example.com')
          .post('/x/y')
          .reply(200, function(uri, body){
            let received = JSON.parse(body);
            expect(received).toEqual(event);
            done();
          });

      let forward = new Forward({
        uri: 'http://test.example.com/x/y'
      });

      forward.run(event);

    });
  });

});
