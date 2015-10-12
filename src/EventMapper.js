'use strict';

var _         = require('lodash');
var Pipeline  = require('./Pipeline');
var Command = require('./Command');
var EventSource = require('./EventSource');

var EventEmitter = require('events');

class EventMapper extends EventEmitter {

  constructor(config) {
    super();
    config = config || {};

    this.sources      = {};
    this.pipelines    = {};

    if (config) {
      this.configure(config);
    }
  }

  processEvent(source, event) {
    var pipeline = this.pipelines[source.name];

    if (!pipeline) {
      throw new Error(`Missing pipeline for source '${source.name}'`);
    }

    var pipelineResult = pipeline.run(event);

    pipelineResult.then(function(event) {
      return Promise.resolve(event);
    }).catch(function(err) {
      console.error(err);
    });

    return pipelineResult;
  }

  configure(sourcesConfig) {
    sourcesConfig = sourcesConfig || {};

    _.each(sourcesConfig, (sourceConf, sourceName) => {
      var EventSourceClass = EventSource.get(sourceConf.type);
      if (!EventSourceClass) {
        throw new Error(`Unable to find an EventSource for type ${sourceConf.type}`);
      }

      sourceConf.process = sourceConf.process || [];

      if (!Array.isArray(sourceConf.process)) {
        sourceConf.process = _.map(sourceConf.process, (commandConf, commandName) => {
          var o = {};
          o[commandName] = commandConf;
          return o;
        });
      }

      var commands = _.map(sourceConf.process, (cmd) => {
        var pair = _.pairs(cmd)[0];
        var commandName = pair[0];
        var commandConf = pair[1];
        var CommandClass = Command.get(commandName);

        if (!CommandClass) {
          throw new Error(`Unable to find a Command for '${commandName}'`);
        }

        return new CommandClass(commandConf);
      });

      this.pipelines[sourceName] = new Pipeline(commands);
      this.sources[sourceName]   = new EventSourceClass(sourceName, sourceConf.config);
    });
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
