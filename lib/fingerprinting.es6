var assert = require("assert"),
    message_types = require("./message_types.js"),
    hashing = require("./hashing"),
    S = require("string");


// Escape sequences for fingerprinting.
// Fingerprinting requires unique digests for unique messages.  The approach is
// to construct a unique long string for unique messages and use a fixed and
// good fingerprinting algorithm to get a smaller digest out of it (64/128 bits
// should be sufficient.)  These escape sequences are used in generating the
// unique long string per message.
var ESCAPE_CHAR = "\x10";
var ESCAPE_CHAR_RE = new RegExp(ESCAPE_CHAR, "g");
var ESCAPE_END = ESCAPE_CHAR + ".";
var BEGIN_TEXT = ESCAPE_CHAR + "'";
var BEGIN_PH = ESCAPE_CHAR + "X";
var BEGIN_TAG = ESCAPE_CHAR + "<";
var END_TAG = ESCAPE_CHAR + ">";

function _escapeTextForMessageId(text) {
  return text.replace(ESCAPE_CHAR_RE, ESCAPE_CHAR + ESCAPE_CHAR);
}

function computeIdForMessageBuilder(msgBuilder) {
  var hasher = new hashing.SHA1();
  for (let part of _genIdParts(msgBuilder)) {
    hasher.update(part);
  }
  return hasher.hexdigest();
}

function* _genIdParts(msgBuilder) {
  yield _escapeTextForMessageId(msgBuilder.meaning || '');
  for (let i of _genIdPartsForSubparts(msgBuilder.parts)) {
    yield i;
  }
}

function* _genIdPartsForSubparts(parts) {
  var placeholders = new Map();
  for (let part of parts) {
    if (typeof part === 'string') {
      yield `${BEGIN_TEXT}${_escapeTextForMessageId(part)}${ESCAPE_END}`;
    } else if (part instanceof message_types.TextPart) {
      yield `${BEGIN_TEXT}${_escapeTextForMessageId(part.value)}${ESCAPE_END}`;
    } else if (part instanceof message_types.PlaceholderBase) {
      placeholders.set(part.name, part);
    } else if (part instanceof message_types.TagPair) {
      yield `${BEGIN_TAG}${part.beginPlaceholderRef.name},${part.getStableTypeName()}${ESCAPE_END}`;
      for (let i in _genIdPartsForSubparts(part.parts)) {
        yield i;
      }
    } else {
      throw Error(`Encountered unknown message part type while computing message ID: ${part.getStableTypeName()}`);
    }
  }
  var placeholderNames = [];
  for (let name of placeholders.keys()) {
    placeholderNames.push(name);
  }
  placeholderNames.sort();
  for (let name of placeholderNames) {
    var placeholder = placeholders.get(name);
    yield `{BEGIN_PH}{name},{placeholder.getStableTypeName()}{ESCAPE_END}`;
  }
}

exports.computeIdForMessageBuilder = computeIdForMessageBuilder;
