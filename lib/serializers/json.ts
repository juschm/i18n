///<reference path='../../typings/node/node.d.ts'/>
import * as assert from 'assert';

import * as M from '../message_types';
import SerializerRegistry, {Serializer} from '../serializer';

// new Set(array) helper.
import newSet from './../newSet';

/**
 * Overview of how we serialize to JSON
 *
 * TODO(chirayu): Fill this section out.
 *   explain message_types vs pojo_types
 */

const TYPENAME_PLACEHOLDER_BY_NAME = "Placeholder";

type PlaceholderPojo = NgExprPojo|TagPairBeginRefPojo|TagPairEndRefPojo;
type MessagePartPojo = TextPartPojo|PlaceholderNamePojo|HtmlTagPairPojo;

interface PojoBase {
  $type: M.StableTypeName;
}

interface TextPartPojo extends PojoBase {
  value: string;
}

function textPartToPojo(part: M.TextPart): TextPartPojo {
  return {
    $type: M.getStableTypeName(part),
    value: part.value
  };
}

function textPartFromPojo(pojo: TextPartPojo): M.TextPart {
  return new M.TextPart(pojo.value);
}

interface _PlaceholderPojo extends PojoBase {
  name: string;
  text: string;
  examples?: string[];
  comment?: string;
}

function _placeholderToPojo(part: M.NgExpr|M.TagPairBeginRef|M.TagPairEndRef): _PlaceholderPojo {
  return {
    $type: M.getStableTypeName(part),
    name: part.name,
    text: part.text,
    examples: part.examples,
    comment: part.comment
  };
}

type NgExprPojo = _PlaceholderPojo;
type TagPairBeginRefPojo = _PlaceholderPojo;
type TagPairEndRefPojo = _PlaceholderPojo;

// M.ConcretePlaceholder types are all serialized into a reference to just their name.
interface PlaceholderNamePojo extends PojoBase {
  name: string;
}

function ngExprToPojo(part: M.NgExpr): NgExprPojo {
  return _placeholderToPojo(part);
}

function ngExprFromPojo(pojo: NgExprPojo): M.NgExpr {
  return new M.NgExpr(pojo.name, pojo.text, pojo.examples, pojo.comment);
}

function beginPlaceholderRefToPojo(part: M.TagPairBeginRef): TagPairBeginRefPojo {
  return _placeholderToPojo(part);
}

function beginPlaceholderRefFromPojo(pojo: TagPairBeginRefPojo): M.TagPairBeginRef {
  return new M.TagPairBeginRef(pojo.name, pojo.text, pojo.examples, pojo.comment);
}

function endPlaceholderRefToPojo(part: M.TagPairEndRef): TagPairEndRefPojo {
  return _placeholderToPojo(part);
}

function endPlaceholderRefFromPojo(pojo: TagPairEndRefPojo): M.TagPairEndRef {
  return new M.TagPairEndRef(pojo.name, pojo.text, pojo.examples, pojo.comment);
}

interface HtmlTagPairPojo extends PojoBase {
  tag: string;
  begin: string;
  end: string;
  parts: MessagePartPojo[];
  examples: string[];
  tagFingerprintLong: string;
  beginPlaceholderRef: PlaceholderNamePojo;
  endPlaceholderRef: PlaceholderNamePojo;
}

function partsToPojo(parts: M.ConcreteMessagePart[]): MessagePartPojo[] {
  var results: MessagePartPojo[] = [];
  parts.forEach(function(part) {
    results.push(messagePartToPojo(part));
  });
  return results;
}

function messagePartToPojo(obj: M.ConcreteMessagePart): MessagePartPojo {
  var stableTypeName = M.getStableTypeName(obj);
  switch (stableTypeName) {
    case M.TYPENAME_TEXT_PART:
        return textPartToPojo(<M.TextPart>obj);
    case M.TYPENAME_NG_EXPR:
    case M.TYPENAME_TAG_PAIR_BEGIN_REF:
    case M.TYPENAME_TAG_PAIR_END_REF:
      return placeholderToNamePojo(<M.ConcretePlaceholder>obj);
    case M.TYPENAME_HTML_TAG_PAIR:
        return htmlTagPairToPojo(<M.HtmlTagPair>obj);
    default: throw Error(`Error: Don't know how to serialize type ${stableTypeName}`);
  }
}

function messagePartFromPojo(obj: MessagePartPojo, placeholdersMap: M.PlaceHoldersMap): M.ConcreteMessagePart {
  var stableTypeName = obj.$type;
  switch (stableTypeName) {
    case M.TYPENAME_TEXT_PART:
        return textPartFromPojo(<TextPartPojo>obj);
    case TYPENAME_PLACEHOLDER_BY_NAME:
        return placeholderFromNamePojo(<PlaceholderNamePojo>obj, placeholdersMap);
    case M.TYPENAME_HTML_TAG_PAIR:
        return htmlTagPairFromPojo(<HtmlTagPairPojo>obj, placeholdersMap);
    default:
        throw Error(`Error: Don't know how to de-serialize type ${stableTypeName}`);
  }
}

function placeholderToNamePojo(obj: M.ConcretePlaceholder): PlaceholderNamePojo {
  return {
    $type: TYPENAME_PLACEHOLDER_BY_NAME,
    name: obj.name
  };
}

function placeholderFromNamePojo(obj: PlaceholderNamePojo, placeholdersMap: M.PlaceHoldersMap): M.ConcretePlaceholder {
  assert(placeholdersMap.has(obj.name));
  return placeholdersMap.get(obj.name);
}

function messagePartsFromPojo(pojos: MessagePartPojo[], placeholdersMap: M.PlaceHoldersMap): M.ConcreteMessagePart[] {
  var parts: M.ConcreteMessagePart[] = [];
  pojos.forEach(function(pojo) {
    parts.push(messagePartFromPojo(pojo, placeholdersMap));
  });
  return parts;
}

function htmlTagPairToPojo(htmlTagPair: M.HtmlTagPair): HtmlTagPairPojo {
  return {
    $type: M.getStableTypeName(htmlTagPair),
    tag: htmlTagPair.tag,
    begin: htmlTagPair.begin,
    end: htmlTagPair.end,
    parts: partsToPojo(htmlTagPair.parts),
    examples: htmlTagPair.examples,
    tagFingerprintLong: htmlTagPair.tagFingerprintLong,
    beginPlaceholderRef: placeholderToNamePojo(htmlTagPair.beginPlaceholderRef),
    endPlaceholderRef: placeholderToNamePojo(htmlTagPair.endPlaceholderRef)
  };
}

function htmlTagPairFromPojo(pojo: HtmlTagPairPojo, phMap: M.PlaceHoldersMap): M.HtmlTagPair {
  return new M.HtmlTagPair(pojo.tag,
                           pojo.begin,
                           pojo.end,
                           messagePartsFromPojo(pojo.parts, phMap),
                           pojo.examples,
                           pojo.tagFingerprintLong,
                           placeholderFromNamePojo(pojo.beginPlaceholderRef, phMap),
                           placeholderFromNamePojo(pojo.endPlaceholderRef, phMap));
}

interface PlaceholdersMapPojo {
  [id: string]: PlaceholderPojo
}

interface MessagePojo extends PojoBase {
  id: string;
  meaning: string;
  comment: string;
  parts: MessagePartPojo[];
  placeholdersMap: PlaceholdersMapPojo;
}


function placeholdersMapToPojo(placeholdersMap: M.PlaceHoldersMap): PlaceholdersMapPojo {
  var results: PlaceholdersMapPojo = {};
  placeholdersMap.forEach(function(placeholder, key) {
    results[key] = placeholderToPojo(placeholder);
  });
  return results;
}

function placeholdersMapFromPojo(pojos: PlaceholdersMapPojo): M.PlaceHoldersMap {
  var placeholdersMap: M.PlaceHoldersMap = new Map<string, M.ConcretePlaceholder>();
  Object.keys(pojos).forEach(function(key) {
    var placeholder = <M.ConcretePlaceholder>placeholderFromPojo(pojos[key]);
    placeholdersMap.set(key, placeholder);
  });
  return placeholdersMap;
}

function messageToPojo(msg: M.Message): MessagePojo {
  return {
    $type: M.getStableTypeName(msg),
    id: msg.id,
    meaning: msg.meaning,
    comment: msg.comment,
    parts: partsToPojo(msg.parts),
    placeholdersMap: placeholdersMapToPojo(msg.placeholdersMap)
  };
}

function messageFromPojo(pojo: MessagePojo): M.Message {
  assert(pojo.$type === M.TYPENAME_MESSAGE);
  var placeholdersMap = placeholdersMapFromPojo(pojo.placeholdersMap);
  return new M.Message(pojo.id,
                       pojo.meaning,
                       pojo.comment,
                       messagePartsFromPojo(pojo.parts, placeholdersMap),
                       placeholdersMap);
}

function placeholderToPojo(obj: M.ConcretePlaceholder): PlaceholderPojo {
  var stableTypeName = M.getStableTypeName(obj);
  switch (stableTypeName) {
    case M.TYPENAME_NG_EXPR:
        return ngExprToPojo(<M.NgExpr>obj);
    case M.TYPENAME_TAG_PAIR_BEGIN_REF:
        return beginPlaceholderRefToPojo(<M.TagPairBeginRef>obj);
    case M.TYPENAME_TAG_PAIR_END_REF:
        return endPlaceholderRefToPojo(<M.TagPairEndRef>obj);
    default: throw Error(`Error: Don't know how to serialize type ${stableTypeName}`);
  }
}

function placeholderFromPojo(obj: PlaceholderPojo): M.ConcretePlaceholder {
  var stableTypeName = obj.$type;
  switch (stableTypeName) {
    case M.TYPENAME_NG_EXPR:
        return ngExprFromPojo(<NgExprPojo>obj);
    case M.TYPENAME_TAG_PAIR_BEGIN_REF:
        return beginPlaceholderRefFromPojo(<TagPairBeginRefPojo>obj);
    case M.TYPENAME_TAG_PAIR_END_REF:
        return endPlaceholderRefFromPojo(<TagPairEndRefPojo>obj);
    default:
        throw Error(`Error: Don't know how to de-serialize type ${stableTypeName}`);
  }
}

class JsonSerializer implements Serializer {
  stringify(obj) {
    assert(M.getStableTypeName(obj) === M.TYPENAME_MESSAGE);
    return JSON.stringify(messageToPojo(obj), null, 4);
  }
  parse(s) {
    return messageFromPojo(JSON.parse(s));
  }
}

function newSerializer(): Serializer {
  if (arguments.length == 0) {
    return new JsonSerializer();
  }
  throw Error(`Error: JSON serializer is not configurable.`);
}

const SERIALIZABLE_TYPES = Object.freeze(newSet<Function>([
    M.TextPart, M.NgExpr, M.TagPairBeginRef, M.TagPairEndRef, M.HtmlTagPair, M.Message]));

function verifyCompatibleSerializableTypes() {
  if (SERIALIZABLE_TYPES.size !== M.SERIALIZABLE_TYPES.size) {
    throw Error("Internal Error: This version of the JSON serializer is incompatible with the version of message_types.ts");
  }
  var numInBoth = 0;
  M.SERIALIZABLE_TYPES.forEach(function(ctor) {
    numInBoth += SERIALIZABLE_TYPES.has(ctor) ? 1 : 0;
  });
  if (numInBoth !== SERIALIZABLE_TYPES.size) {
    throw Error("Internal Error: This version of the JSON serializer is incompatible with the version of message_types.ts");
  }
}

export default function init() {
  verifyCompatibleSerializableTypes();
  SerializerRegistry.register("json", newSerializer);
}
