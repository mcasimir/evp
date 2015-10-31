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
        this.logger.log('info', 'Event Processed', {
            source: evt.source.uniqueName,
            event:  evt.event,
            result: evt.result
          });
      });

      source.on('eventProcessingError', (err) => {
        this.emit('eventProcessingError', err);
        this.logger.log('error', 'Processor Error', {
          source: err.source.uniqueName,
          event:  err.event,
          error:  err.error
        });
      });

      return source.listen();
    });

    return Promise.all(promises);
  }

}

module.exports = Processor;
