'use strict';

var jsonPath = require('../src/utils/jsonPath');

describe('jsonPath', function() {

  it('Should allow to select a value by path', function() {
    var res = jsonPath({ x: 2 }, '$.x');
    expect(res).toEqual([2]);
  });

  it('Should allow to select a node only if it has a certain value', function() {
    var res = jsonPath({ x: 2 }, '?(@.x==2)');
    expect(res).toEqual([{x: 2}]);
    res = jsonPath({ x: 2 }, '?(@.x==3)');
    expect(res).toEqual([]);
  });

  it('Should never throw on invalid expression', function() {
    expect(() => {
      jsonPath({ x: 2 }, '-#123#°');
    }).not.toThrow();
  });

  it('Should return an empty array on invalid expression', function() {
    var res = jsonPath({ x: 2 }, '-#123#°');
    expect(res).toEqual([]);
  });

  it('Should return an empty array on empty expression', function() {
    var res = jsonPath({ x: 2 }, '');
    expect(res).toEqual([]);
  });

});
