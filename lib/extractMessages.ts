/// <reference path="../typings/node/node.d.ts" />

require('source-map-support').install();

var ckckStringify = require('./../ckckStringify');

import {AppConfig, loadAppConfig} from './config';
import {Message} from './message_types';
import SerializerRegistry from './serializer';

var assert = require("assert"),
    fs = require("fs"),
    parseHtml = require("./parse_html").parseHtml,
    parseMessages = require("./parse_messages").parseMessages;


export class Extractor {
  constructor(public config: AppConfig) {}

  writeMessagesToJson(messages: Message[]) {
    var dst = this.config.dataDir + "/messages.json";
    console.log(`Writing JSON to file: ${dst}`);
    var jsonSerializer = SerializerRegistry.create('json');
    // TODO: jsonSerializer should be able to deal with a collection of messages.
    var jsonItems: string[] = [];
    messages.forEach(function(value) {
      jsonItems.push(jsonSerializer.stringify(value));
    });
    var jsonText = `[\n${jsonItems.join(",\n")}\n]`;
    fs.writeFileSync(dst, jsonText, {encoding: "utf-8"});
  }

  run() {
    var allMessages: Message[] = [];
    for (let src of this.config.htmlSrcs) {
      console.log(`Processing file: ${src}`);
      var html:string = fs.readFileSync(src, {encoding: "utf-8"});
      // assertValidHtml(html);
      parseMessages(parseHtml(html)).forEach(function(message: Message) {
        allMessages.push(message);
      });
      // todo: compare with previous extraction?
      // todo: what's the database?  where is it?
      // todo: the same message can be found in multiple source files
      // todo: what src file should be associated with the message?
    }
    this.writeMessagesToJson(allMessages);
  }

  debugRun() {
    for (let src of this.config.htmlSrcs) {
      var html:string = fs.readFileSync(src, {encoding: "utf-8"});
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
        });
      }
    }
  }
}

export default function main() {
  console.log("Using default application config (i18n.json)");
  new Extractor(loadAppConfig()).run();
}
