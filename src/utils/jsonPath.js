'use strict';

var JSONPath = require('JSONPath');

function singleEval(obj, expr) {
  try {
    if (expr.trim().match(/^\?/)) {
      obj = Array.isArray(obj) ? obj : [obj];
      expr = `$.[${expr}]`;
    }

    var res = JSONPath.eval(obj, expr);
    return Array.isArray(res) ? res : [];
  } catch (e) {
    return [];
  }
}

module.exports = function(obj, expr){

  var exprPipe = expr.split('|');

  if (exprPipe.length) {

    let currObj = obj;

    exprPipe.forEach(function(currExpr){
      currObj = singleEval(currObj, currExpr);
    });

    return currObj;

  } else {

    return [];

  }

};
