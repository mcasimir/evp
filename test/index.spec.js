'use strict';

var evp = require('..');
var Processor = require('../src/Processor');

describe('index.js', function() {
  it('should export evp', function() {
    expect(evp instanceof Processor).toBe(true);
    expect(typeof evp.registerCommand).toBe('function');
    expect(typeof evp.registerSource).toBe('function');
  });
});
