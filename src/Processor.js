'use strict';

var _         = require('lodash');
var JsonDsl  = require('./dsl/JsonDsl');
var EventEmitter = require('events');

class Processor extends EventEmitter {

  constructor(config) {
    super();
    config = config || {};

    this.sources      = {};

    if (config) {
      this.configure(config);
    }
  }

  configure(sourcesConfig) {
    var parser = new JsonDsl();
    this.sources = parser.parse(sourcesConfig);
  }

  listen() {
    var promises = _.map(this.sources, (source) => {

      source.on('eventProcessed', (evt) => {
        this.emit('eventProcessed', evt);
      });

      source.on('eventProcessingError', (err) => {
        this.emit('eventProcessingError', err);
      });

      return source.listen();
    });

    return Promise.all(promises);
  }

}

module.exports = Processor;
