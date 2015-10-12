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
      source.on('event', (event) => {
        this
          .processEvent(source, event)
          .then((result) => {
            this.emit('eventProcessed', {source: source, result: result});
          })
          .catch((error) => {
            this.emit('eventProcessingError', {source: source, error: error});
          });
      });
      return source.listen();
    });

    return Promise.all(promises);
  }

}

module.exports = EventMapper;
