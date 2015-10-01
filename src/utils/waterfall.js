'use strict';

function waterfall(fns, init){

  return fns.reduce((acc, fn) => {
    return acc.then(fn);
  }, Promise.resolve(init));

}

module.exports = waterfall;
