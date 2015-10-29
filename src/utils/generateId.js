'use strict';

let curr = 1;

module.exports = function() {
  return process.pid + '-' + curr++;
};
