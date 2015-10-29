'use strict';

let evp       = require('../src/evp');
let Processor = require('../src/Processor');
let Command   = require('../src/Command');
let Source    = require('../src/Source');
let Logger    = require('../src/Logger');
let JsonDsl   = require('../src/dsl/JsonDsl');
let glob      = require('glob');
let path      = require('path');
let _         = require('lodash');

describe('evp', function() {
  beforeEach(function() {
    this.commandRegistryBackup  = Object.assign({}, Command.registry);
    this.sourceRegistryBackup   = Object.assign({}, Source.registry);
  });

  afterEach(function() {
    Command.registry = this.commandRegistryBackup;
    Source.registry = this.soucreRegistryBackup;
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

  it('should expose logger', function() {
    expect(evp.logger).toBe(Logger.getGlobalLogger());
  });

  it('should expose dsl', function() {
    expect(evp.dsl instanceof JsonDsl).toBe(true);
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

  it('should make all the defined commands available', function(done) {
    Command.registry = this.commandRegistryBackup;
    Source.registry = this.soucreRegistryBackup;

    glob(path.resolve(__dirname, '../src/commands/*.js'), {nonull: false, nodir: true}, function (er, files) {
      let definedCommands = files.map(function(file) {
        return path.basename(file, '.js');
      });

      let availableCommands = _.values(evp.Command.registry).map(function(CommandClass){
        return CommandClass.name;
      });

      expect(availableCommands).toEqual(definedCommands);
      done();
    });
  });

});
