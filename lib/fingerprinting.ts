import * as assert from 'assert';
import * as M from './message_types';
import {MessageBuilder} from './parse_messages';
import {SHA1} from './hashing';
var S = require('string');

// Escape sequences for fingerprinting.
// Fingerprinting requires unique digests for unique messages.  The approach is
// to construct a unique long string for unique messages and use a fixed and
// good fingerprinting algorithm to get a smaller digest out of it (64/128 bits
// should be sufficient.)  These escape sequences are used in generating the
// unique long string per message.
const ESCAPE_CHAR = "\x10";
const ESCAPE_CHAR_RE = new RegExp(ESCAPE_CHAR, "g");
const ESCAPE_END = ESCAPE_CHAR + ".";
const BEGIN_TEXT = ESCAPE_CHAR + "'";
const BEGIN_PH = ESCAPE_CHAR + "X";
const BEGIN_TAG = ESCAPE_CHAR + "<";
const END_TAG = ESCAPE_CHAR + ">";

function _escapeTextForMessageId(text: string): string {
  return text.replace(ESCAPE_CHAR_RE, ESCAPE_CHAR + ESCAPE_CHAR);
}

type OnPart = (part: string) => void;

export function computeIdForMessageBuilder(msgBuilder: MessageBuilder): string {
  var hasher = new SHA1();
  _genIdParts(msgBuilder, function(part) {
    hasher.update(part);
  });
  return hasher.hexdigest();
}

function _genIdParts(msgBuilder: MessageBuilder, onPart: OnPart): void {
  onPart(_escapeTextForMessageId(msgBuilder.meaning || ''));
  _genIdPartsForSubparts(msgBuilder.parts, onPart);
}

function _genIdPartsForSubparts(parts: M.ConcreteMessagePart[], onPart: OnPart): void {
  var placeholders = new Map<string, M.ConcretePlaceholder>();
  for (let part of parts) {
    if (part instanceof M.TextPart) {
      onPart(`${BEGIN_TEXT}${_escapeTextForMessageId(part.value)}${ESCAPE_END}`);
    } else if (part instanceof M.PlaceholderBase) {
      placeholders.set(part.name, part);
    } else if (part instanceof M.TagPair) {
      onPart(`${BEGIN_TAG}${part.beginPlaceholderRef.name},${M.getStableTypeName(part)}${ESCAPE_END}`);
      _genIdPartsForSubparts(part.parts, onPart);
    } else {
      throw Error(`Encountered unknown message part type while computing message ID: ${M.getStableTypeName(part)}`);
    }
  }
  var placeholderNames: string[] = [];
  placeholders.forEach(function(_, name) {
    placeholderNames.push(name);
  });
  placeholderNames.sort();
  for (let name of placeholderNames) {
    var placeholder = placeholders.get(name);
    onPart(`${BEGIN_PH}${name},${M.getStableTypeName(placeholder)}${ESCAPE_END}`);
  }
}
