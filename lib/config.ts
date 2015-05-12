import * as assert from 'assert';
import * as fs from 'fs';

import registerJsonSerializer from './serializers/json';
registerJsonSerializer();

export class AppConfig {
  htmlSrcs: string[];
  dataDir: string; // where extracted messages, etc. are stored.
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

var defaultValues = new AppConfig();
defaultValues.dataDir = "i18nData";

export function loadConfigFromFile(fname: string): AppConfig {
  var jsonText = fs.readFileSync(fname, {encoding: "utf-8"});
  var config = JSON.parse(jsonText);
  assert(config.htmlSrcs !== void 0);
  if (config.dataDir === void 0) {
    config.dataDir = defaultValues.dataDir;
  }
  return config;
}

export function loadAppConfig(): AppConfig {
  return loadConfigFromFile(DEFAULT_CONFIG_FNAME);
}
