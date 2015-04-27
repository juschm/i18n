var assert = require("assert");
var fs = require("fs");
var internalJson_1 = require('./serializers/internalJson');
internalJson_1.default();
var AppConfig = (function () {
    function AppConfig() {
    }
    return AppConfig;
})();
exports.AppConfig = AppConfig;
var DEFAULT_CONFIG_FNAME = "i18n.json";
function loadConfigFromFile(fname) {
    var jsonText = fs.readFileSync(fname, { encoding: "utf-8" });
    var config = JSON.parse(jsonText);
    assert(config.htmlSrcs !== void 0);
    return config;
}
exports.loadConfigFromFile = loadConfigFromFile;
function loadAppConfig() {
    return loadConfigFromFile(DEFAULT_CONFIG_FNAME);
}
exports.loadAppConfig = loadAppConfig;
// Support importing from babeljs transpiled files.
exports.__esModule = true;
//# sourceMappingURL=config.js.map