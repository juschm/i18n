var assert = require("assert");
var fs = require("fs");
var json_1 = require('./serializers/json');
json_1["default"]();
var AppConfig = (function () {
    function AppConfig() {
    }
    return AppConfig;
})();
exports.AppConfig = AppConfig;
var DEFAULT_CONFIG_FNAME = "i18n.json";
var defaultValues = new AppConfig();
defaultValues.dataDir = "i18nData";
function loadConfigFromFile(fname) {
    var jsonText = fs.readFileSync(fname, { encoding: "utf-8" });
    var config = JSON.parse(jsonText);
    assert(config.htmlSrcs !== void 0);
    if (config.dataDir === void 0) {
        config.dataDir = defaultValues.dataDir;
    }
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