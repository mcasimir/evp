'use strict';

var nock = require('nock');
var Forward = require('../src/commands/Forward');

describe('Forward', function() {

  describe('run', function() {
    it('should issue a POST http call passing stringifyied event as body', function(done) {

      var event = {
        a: 1,
        b: 2
      };

      nock('http://test.example.com')
          .post('/x/y')
          .reply(200, function(uri, body){
            var received = JSON.parse(body);
            expect(received).toEqual(event);
            done();
          });

      var forward = new Forward({
        uri: 'http://test.example.com/x/y'
      });

      forward.run(event);

    });
  });

});
