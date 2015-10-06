[![Build Status](https://travis-ci.org/mcasimir/evp.svg?branch=master)](https://travis-ci.org/mcasimir/evp)

# evp (Event Pipeline)

Listen from JSON Event sources and to process each event
adapting and either forwarding it to an http/https sink or to a mssql database.

Event are processed according to rules defined in a JSON configuration file.

### JSON Dsl

Configuration files are JSON files of the form:

``` json
{
  "sourceName1": {
    "type": "RabbitMQ",
    "config": {
      "host": "192.168.50.4"
    },
    "process": {
      "transform": {
        "a":  "$.nested.a",
        "b":  "$.nested.b"
      },
      "forward": {
        "uri": "http://example.com/dbo/lots"
      }
    }
  },
  "sourceName2": {
    // ...
  }
}
```

### Built in commands

#### Transform

Applies a transform template to input event and send the result to the next command.

Transform pulls data from original event using JSONPath and generate a new object based on a template.

Each of the template's properties can pull a single property from the source data or an array of all results found by its JSONPath.

When pulling an array of data you can also supply a subtemplate to transform each item in the array.

JSONPath is like XPath for JavaScript objects. To learn the syntax, read the documentation for the JSONPath package on npm and the original article by Stefan Goessner.

See https://www.npmjs.com/package/jsonpath-object-transform for details.

Options

- `transform`: A `jsonpath-object-transform` object template.

```
"transform": {
  "a":  "$.nested.a",
  "b":  "$.nested.b"
},
```

#### Forward

Issue an HTTP requrest sending the event as body.

Options:

- `forward`: A request js object. See https://github.com/request/request#requestoptions-callback.

**NOTE**: `Forward` default HTTP method is POST, while request.js' one is GET.

#### Inspect

Inspect command just print each event to the standard output

Options:

- `inspect.prompt`: A prompt to display along with the event
- `inspect.depth`: `depth` to pass to `util.inspect` default to `null`

## Programmatic Api

The core is independent from specific sources and allows for different
commands implementation and extension:

``` js
EventMapper.registerEventSource('myEventSourceName', MyEventSource);
EventMapper.registerCommand('myCommandName', MyCommand);

var eventMapper = new EventMapper();

eventMapper.configure(config);
eventMapper.listen();
```

### Implementing an EventSource

1. Extend EventSource and implement listen()
2. Register the new event source into EventMapper;

NOTE: config for the eventsource will be available in `this.config`.

``` js
class MyEventSource extends EventSource {

  listen() {
    setInterval(() => {
      this.event({
        time: (new Date()).getTime();
      });
    }, this.config.interval)
  }

}

EventMapper.registerEventSource('MySource', MyEventSource);
```

``` json
{
  "mySource1": {
    "type": "MySource",
    "config": {
      "interval": 1000
    }
  }
}
```

### Implementing a Command

1. Extend Command and implement run()
2. Register the new command into EventMapper;

NOTE: config for the eventsource will be available in `this.config`.

``` js
class MailCommand extends Command {
  run(event){
    var body = JSON.stringify(event, null, 2);
    sendMail(this.config.recipient, body);
    return Promise.resolve(event); // forward to next
  }
}

EventMapper.registerCommand('email', MyCommand);
```

``` json
{
  "mySource1": {
    "type": "MySource",
    "config": {
      "interval": 1000
    },
    "process": {
      "email": {
        "recipient": "john@example.com"
      }
    }
  }
}
```
