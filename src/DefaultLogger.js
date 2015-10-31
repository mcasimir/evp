'use strict';

let inspect = require('util').inspect;

class DefaultLogger {
  constructor(options) {
    options = options || {};

    this.levels = options.levels || {
      error:    0,
      warn:     1,
      info:     2,
      verbose:  3,
      debug:    4,
      silly:    5
    };

    this.level = options.level || 'info';
  }

  getCurrentPriority() {
    return this.getPriorityFor(this.level);
  }

  getPriorityFor(level) {
    let priority = this.levels[level];
    return Number.isInteger(priority) ? priority : Infinity;
  }

  log(level, message, meta) {
    if (this.getPriorityFor(level) <= this.getCurrentPriority()) {
      let prompt = `[${level}] ${message}`.trim();

      if (meta !== undefined) {
        console.log(prompt, inspect(meta, { depth: null }));
      } else {
        console.log(prompt);
      }
    }
  }
}

module.exports = DefaultLogger;
