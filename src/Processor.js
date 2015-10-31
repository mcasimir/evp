'use strict';

let _            = require('lodash');
let JsonDsl      = require('./dsl/JsonDsl');
let EventEmitter = require('events');
let Logger       = require('./Logger');

class Processor extends EventEmitter {

  constructor(config) {
    super();
    config = config || {};

    this.sources      = {};
    this.logger       = Logger;
    this.parser       = new JsonDsl();

    if (config) {
      this.configure(config);
    }
  }

  configure(sourcesConfig) {
    this.sources = this.parser.parse(sourcesConfig);
  }

  listen() {
    let promises = _.map(this.sources, (source) => {

      source.on('eventProcessed', (evt) => {
        this.emit('eventProcessed', evt);
        this.logger.log('info', 'Event Processed', evt);
      });

      source.on('eventProcessingError', (err) => {
        this.emit('eventProcessingError', err);
        this.logger.log('error', 'Event Processing Error', err);
      });

      return source.listen();
    });

    return Promise.all(promises);
  }

}

module.exports = Processor;
