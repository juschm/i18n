declare function require(name:string);

var assert = require("assert");
var fs = require("fs");

import registerJsonSerializer from './serializers/json';
registerJsonSerializer();

export class AppConfig {
  htmlSrcs: string[];
  // serializers: TODO
  // locales: [],
  // pseudoLocales: [],
  // web roots
  // pseudolocales
  // strict mode
  // fingerprinting method
  // extraction file format
  // extracted files/working directory
  // file naming schemes for the extracted translation files and the names of bundles received from the translators
  //     incoming directory?
  // url schemes/transforms
  //    index.html ->
  //        index-en.html
  //        en/US/index.html
  //        index.html?hl=en&gl=US
  //    declarative vs. imperative
  //    imperative will NOT allow use of non-JS tools
}

const DEFAULT_CONFIG_FNAME = "i18n.json";

export function loadConfigFromFile(fname): AppConfig {
  var jsonText = fs.readFileSync(fname, {encoding: "utf-8"});
  var config = JSON.parse(jsonText);
  assert(config.htmlSrcs !== void 0);
  return config;
}


export function loadAppConfig(): AppConfig {
  return loadConfigFromFile(DEFAULT_CONFIG_FNAME);
}

// Support importing from babeljs transpiled files.
export var __esModule = true;
