require('source-map-support').install();
var ckckStringify = require('./../ckckStringify');
var config_1 = require('./config');
var serializer_1 = require('./serializer');
var assert = require("assert"), fs = require("fs"), parseHtml = require("./parse_html").parseHtml, parseMessages = require("./parse_messages").parseMessages;
var Extractor = (function () {
    function Extractor(config) {
        this.config = config;
    }
    Extractor.prototype.writeMessagesToJson = function (messages) {
        var dst = this.config.dataDir + "/messages.json";
        console.log("Writing JSON to file: " + dst);
        var jsonSerializer = serializer_1.default.create('json');
        // TODO: jsonSerializer should be able to deal with a collection of messages.
        var jsonItems = [];
        messages.forEach(function (value) {
            jsonItems.push(jsonSerializer.stringify(value));
        });
        var jsonText = "[\n" + jsonItems.join(",\n") + "\n]";
        fs.writeFileSync(dst, jsonText, { encoding: "utf-8" });
    };
    Extractor.prototype.run = function () {
        var allMessages = [];
        for (var _i = 0, _a = this.config.htmlSrcs; _i < _a.length; _i++) {
            var src = _a[_i];
            console.log("Processing file: " + src);
            var html = fs.readFileSync(src, { encoding: "utf-8" });
            // assertValidHtml(html);
            parseMessages(parseHtml(html)).forEach(function (message) {
                allMessages.push(message);
            });
        }
        this.writeMessagesToJson(allMessages);
    };
    Extractor.prototype.debugRun = function () {
        for (var _i = 0, _a = this.config.htmlSrcs; _i < _a.length; _i++) {
            var src = _a[_i];
            var html = fs.readFileSync(src, { encoding: "utf-8" });
            var rootNode = parseHtml(html);
            var messages = parseMessages(rootNode);
            var logStringify = 0;
            var logPojo = 0;
            var logDumpParse = 1;
            if (logStringify) {
                console.log(ckckStringify(messages));
            }
            if (logPojo) {
                var jsonSerializer = serializer_1.default.create('json');
                messages.forEach(function (value) {
                    console.log(jsonSerializer.stringify(value));
                });
            }
            if (logDumpParse) {
                var jsonSerializer = serializer_1.default.create('json');
                messages.forEach(function (value) {
                    console.log("\n\nVALUE: %s\n\n", ckckStringify(value));
                    console.log("\n\nJSON: %s\n\n", jsonSerializer.stringify(value));
                    console.log("\n\nPARSED: %s\n\n", ckckStringify(jsonSerializer.parse(jsonSerializer.stringify(value))));
                });
            }
        }
    };
    return Extractor;
})();
exports.Extractor = Extractor;
function main() {
    console.log("Using default application config (i18n.json)");
    new Extractor(config_1.loadAppConfig()).run();
}
exports.default = main;
//# sourceMappingURL=extractMessages.js.map