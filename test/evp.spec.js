'use strict';

let evp = require('../src/evp');
let Processor = require('../src/Processor');
let Command = require('../src/Command');
let Source = require('../src/Source');
// let glob = require('glob');
// let path = require('path');

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
    //     let className = path.basename(file, '.js');
    //   });
    //   done();
    // });
  });

});
