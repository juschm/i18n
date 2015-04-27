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

function freeze<T>(obj:T): T { return Object.freeze(obj); }

interface PojoBase {
  $stableTypeName: M.StableTypeName;
}

const SERIALIZABLE_TYPES = Object.freeze(newSet<Function>([
    M.TextPart, M.NgExpr, M.TagPairBeginRef, M.TagPairEndRef, M.HtmlTagPair, M.Message]));

interface TextPartPojo extends PojoBase {
  value: string;
}

function textPartToPojo(part: M.TextPart): TextPartPojo {
  return {
    $stableTypeName: M.getStableTypeName(part),
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
    $stableTypeName: M.getStableTypeName(part),
    name: part.name,
    text: part.text,
    examples: part.examples,
    comment: part.comment
  };
}

type NgExprPojo = _PlaceholderPojo;
type TagPairBeginRefPojo = _PlaceholderPojo;
type TagPairEndRefPojo = _PlaceholderPojo;

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
  parts: PojoTypes[];
  examples: string[];
  tagFingerprintLong: string;
  beginPlaceholderRef: TagPairBeginRefPojo;
  endPlaceholderRef: TagPairEndRefPojo;
}

function partsToPojo(parts: M.ConcreteMessagePart[]): PojoTypes[] {
  var results: PojoTypes[] = [];
  parts.forEach(function(part) {
    results.push(toPojo(part));
  });
  return results;
}

function partsFromPojo(pojos: PojoTypes[]): M.ConcreteMessagePart[] {
  var parts: M.ConcreteMessagePart[] = [];
  pojos.forEach(function(pojo) {
    parts.push(<M.ConcreteMessagePart>fromPojo(pojo));
  });
  return parts;
}

function htmlTagPairToPojo(htmlTagPair: M.HtmlTagPair): HtmlTagPairPojo {
  return {
    $stableTypeName: M.getStableTypeName(htmlTagPair),
    tag: htmlTagPair.tag,
    begin: htmlTagPair.begin,
    end: htmlTagPair.end,
    parts: partsToPojo(htmlTagPair.parts),
    examples: htmlTagPair.examples,
    tagFingerprintLong: htmlTagPair.tagFingerprintLong,
    beginPlaceholderRef: beginPlaceholderRefToPojo(htmlTagPair.beginPlaceholderRef),
    endPlaceholderRef: endPlaceholderRefToPojo(htmlTagPair.endPlaceholderRef)
  };
}

function htmlTagPairFromPojo(pojo: HtmlTagPairPojo): M.HtmlTagPair {
  return new M.HtmlTagPair(pojo.tag,
                           pojo.begin,
                           pojo.end,
                           partsFromPojo(pojo.parts),
                           pojo.examples,
                           pojo.tagFingerprintLong,
                           beginPlaceholderRefFromPojo(pojo.beginPlaceholderRef),
                           endPlaceholderRefFromPojo(pojo.endPlaceholderRef));
}

interface PlaceholdersMapPojo {
  [id: string]: PlaceholderPojoTypes
}

interface MessagePojo extends PojoBase {
  id: string;
  meaning: string;
  comment: string;
  parts: PojoTypes[];
  placeholdersMap: PlaceholdersMapPojo;
}


function placeholdersMapToPojo(placeholdersMap: M.PlaceHoldersMap): PlaceholdersMapPojo {
  var results: PlaceholdersMapPojo = {};
  placeholdersMap.forEach(function(placeholder, key) {
    results[key] = (<PlaceholderPojoTypes>toPojo(placeholder));
  });
  return results;
}

function placeholdersMapFromPojo(pojos: PlaceholdersMapPojo): M.PlaceHoldersMap {
  var placeholdersMap: M.PlaceHoldersMap = new Map<string, M.ConcretePlaceholder>();
  Object.keys(pojos).forEach(function(key) {
    var placeholder = <M.ConcretePlaceholder>fromPojo(pojos[key]);
    placeholdersMap.set(key, placeholder);
  });
  return placeholdersMap;
}

function messageToPojo(msg: M.Message): MessagePojo {
  return {
    $stableTypeName: M.getStableTypeName(msg),
    id: msg.id,
    meaning: msg.meaning,
    comment: msg.comment,
    parts: partsToPojo(msg.parts),
    placeholdersMap: placeholdersMapToPojo(msg.placeholdersMap)
  };
}

function messageFromPojo(pojo: MessagePojo): M.Message {
  return new M.Message(pojo.id,
                       pojo.meaning,
                       pojo.comment,
                       partsFromPojo(pojo.parts),
                       placeholdersMapFromPojo(pojo.placeholdersMap));
}

type PlaceholderPojoTypes = NgExprPojo|TagPairBeginRefPojo|TagPairEndRefPojo;
type PojoTypes = TextPartPojo|PlaceholderPojoTypes|HtmlTagPairPojo|MessagePojo;


function toPojo(obj: M.SerializableTypes): PojoTypes {
  var stableTypeName = M.getStableTypeName(obj);
  switch (stableTypeName) {
    case M.TYPENAME_TEXT_PART:
        return textPartToPojo(<M.TextPart>obj);
    case M.TYPENAME_NG_EXPR:
        return ngExprToPojo(<M.NgExpr>obj);
    case M.TYPENAME_TAG_PAIR_BEGIN_REF:
        return beginPlaceholderRefToPojo(<M.TagPairBeginRef>obj);
    case M.TYPENAME_TAG_PAIR_END_REF:
        return endPlaceholderRefToPojo(<M.TagPairEndRef>obj);
    case M.TYPENAME_HTML_TAG_PAIR:
        return htmlTagPairToPojo(<M.HtmlTagPair>obj);
    case M.TYPENAME_MESSAGE:
        return messageToPojo(<M.Message>obj);
    default: throw Error(`Error: Don't know how to serialize type ${stableTypeName}`);
  }
}


function fromPojo(obj: PojoTypes): M.SerializableTypes {
  var stableTypeName = obj.$stableTypeName;
  switch (stableTypeName) {
    case M.TYPENAME_TEXT_PART:
        return textPartFromPojo(<TextPartPojo>obj);
    case M.TYPENAME_NG_EXPR:
        return ngExprFromPojo(<NgExprPojo>obj);
    case M.TYPENAME_TAG_PAIR_BEGIN_REF:
        return beginPlaceholderRefFromPojo(<TagPairBeginRefPojo>obj);
    case M.TYPENAME_TAG_PAIR_END_REF:
        return endPlaceholderRefFromPojo(<TagPairEndRefPojo>obj);
    case M.TYPENAME_HTML_TAG_PAIR:
        return htmlTagPairFromPojo(<HtmlTagPairPojo>obj);
    case M.TYPENAME_MESSAGE:
        return messageFromPojo(<MessagePojo>obj);
    default:
        throw Error(`Error: Don't know how to serialize type ${stableTypeName}`);
  }
}


class JsonSerializer implements Serializer {
  stringify(obj) {
    return JSON.stringify(toPojo(obj), null, 4);
  }
  parse(s) {
    return fromPojo(JSON.parse(s));
  }
}

function newSerializer(): Serializer {
  if (arguments.length == 0) {
    return new JsonSerializer();
  }
  throw Error(`Error: JSON serializer is not configurable.`);
}


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
