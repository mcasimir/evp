'use strict';

var evp = require('../src/evp');
var Processor = require('../src/Processor');
var Command = require('../src/Command');
var Source = require('../src/Source');
var glob = require('glob');
var path = require('path');

describe('evp', function() {
  beforeEach(function() {
    delete Command.registry;
    delete Source.registry;
  });

  it('should be a Processor', function() {
    expect(evp instanceof Processor).toBe(true);
  });

  it('should expose Command class', function() {
    expect(evp.Command).toBe(Command);
  });

  it('should expose Source class', function() {
    expect(evp.Source).toBe(Source);
  });

  it('should allow to register a new Command with class', function() {
    class Cmd1 extends Command {}
    evp.registerCommand('cmd', Cmd1);
    expect(Command.get('cmd')).toBe(Cmd1);
  });

  it('should allow to register a new Source with class', function() {
    class Src1 extends Source {}
    evp.registerSource('src', Src1);
    expect(Source.get('src')).toBe(Src1);
  });

  xit('should make all the defined commands available', function() {
    // glob(path.resolve(__dirname, '../src/commands/*.js'), {nonull: false, nodir: true}, function (er, files) {
    //   files.forEach(function(file) {
    //     var className = path.basename(file, '.js');
    //   });
    //   done();
    // });
  });

});
