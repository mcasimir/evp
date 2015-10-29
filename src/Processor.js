'use strict';

var _            = require('lodash');
var JsonDsl      = require('./dsl/JsonDsl');
var EventEmitter = require('events');
var Logger       = require('./Logger');

class Processor extends EventEmitter {

  constructor(config) {
    super();
    config = config || {};

    this.sources      = {};
    this.logger       = Logger.getGlobalLogger();
    this.dsl          = new JsonDsl();

    if (config) {
      this.configure(config);
    }
  }

  configure(sourcesConfig) {
    this.sources = this.dsl.parse(sourcesConfig);
  }

  listen() {
    var promises = _.map(this.sources, (source) => {

      source.on('eventProcessed', (evt) => {
        this.emit('eventProcessed', evt);
        this.logger('debug', 'eventProcessed', evt);
      });

      source.on('eventProcessingError', (err) => {
        this.emit('eventProcessingError', err);
        this.logger('error', 'eventProcessingError', err);
      });

      return source.listen();
    });

    return Promise.all(promises);
  }

}

module.exports = Processor;
