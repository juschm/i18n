declare function require(name:string);

require('source-map-support').install();

var ckckStringify = require('./../ckckStringify');

import {loadAppConfig} from './config';
import {Message} from './message_types';
import SerializerRegistry from './serializer';

var assert = require("assert"),
    fs = require("fs"),
    parseHtml = require("./parse_html").parseHtml,
    parseMessages = require("./parse_messages").parseMessages;

function main() {
  var config = loadAppConfig();
  for (let src of config.htmlSrcs) {
    var html:string = fs.readFileSync(src, {encoding: "utf-8"});
    // assertValidHtml(html);
    var rootNode = parseHtml(html);
    var messages:Map<string, Message> = parseMessages(rootNode);

    var logStringify = 0;
    var logPojo = 0;
    var logDumpParse = 1;

    if (logStringify) {
      console.log(ckckStringify(messages));
    }

    if (logPojo) {
      var jsonSerializer = SerializerRegistry.create('json');
      messages.forEach(function(value) {
        console.log(jsonSerializer.stringify(value));
      });
    }

    if (logDumpParse) {
      var jsonSerializer = SerializerRegistry.create('json');
      messages.forEach(function(value) {
        console.log("\n\nVALUE: %s\n\n", ckckStringify(value));
        console.log("\n\nJSON: %s\n\n", jsonSerializer.stringify(value));
        console.log("\n\nPARSED: %s\n\n", ckckStringify(jsonSerializer.parse(jsonSerializer.stringify(value))));
        // console.log(jsonSerializer.stringify(jsonSerializer.parse(jsonSerializer.stringify(value))));
      });
    }

    // writeMessagesToJson(messages);

    // todo: compare with previous extraction?
    // todo: what's the database?  where is it?
    // todo: the same message can be found in multiple source files
    // todo: what src file should be associated with the message?
  }
}

main();
