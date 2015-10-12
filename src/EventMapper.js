'use strict';

var _         = require('lodash');
var JsonConfigurationParser  = require('./json/JsonConfigurationParser');
var EventEmitter = require('events');

class EventMapper extends EventEmitter {

  constructor(config) {
    super();
    config = config || {};

    this.sources      = {};

    if (config) {
      this.configure(config);
    }
  }

  configure(sourcesConfig) {
    var parser = new JsonConfigurationParser();
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

module.exports = EventMapper;
