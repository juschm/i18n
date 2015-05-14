/// <reference path="../typings/jasmine/jasmine.d.ts" />
require('source-map-support').install();

var parseMessages = require("../lib/parse_messages").parseMessages;
var parseHtml = require("../lib/parse_html").parseHtml;
var fs = require("fs");

describe("parse_messages", function() {
  it("basic", function() {
    var html = fs.readFileSync("spec/parse_messages_test_1.html", {encoding: "utf-8"});
    var dom = parseHtml(html);
    var messages = parseMessages(dom);
    console.log(messages);
  });
});
