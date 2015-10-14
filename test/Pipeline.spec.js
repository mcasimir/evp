'use strict';

var Pipeline = require('../src/Pipeline');
var Command = require('../src/Command');

describe('Pipeline', function() {
  var pipeline1;

  beforeEach(function() {
    var cmd1 = Command.create({
      run: function(evt) {
        evt.cmds.push('cmd1');
        return Promise.resolve(evt);
      }});

    var cmd2 = Command.create(
      {run: function(evt) {
        evt.cmds.push('cmd2');
        return Promise.resolve(evt);
      }});


    pipeline1 = new Pipeline([cmd1, cmd2]);
  });

  describe('run', function() {
    it('should run internal commands in sequence', function(done) {
      pipeline1.run({cmds: []}).then(function(evt) {
        expect(evt.cmds).toEqual(['cmd1', 'cmd2']);
        done();
      });
    });
  });

});
