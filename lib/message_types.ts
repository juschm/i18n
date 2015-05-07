///<reference path="collections.d.ts" />

/**
 * Message Types Reference
 *
 * Actual types will be in TypeScript 1.5+.  However, this TypeScript 1.4
 * version is the current official type specification.
 */

// new Set(array) helper.
import newSet from './newSet';

export type AbstractMessagePart = TextPart|Placeholder|TagPair;
export type ConcretePlaceholder = NgExpr|TagPairBeginRef|TagPairEndRef;
export type ConcreteTagPair = HtmlTagPair;
export type ConcreteMessagePart = TextPart|ConcretePlaceholder|ConcreteTagPair;
export type SerializableTypes = ConcreteMessagePart|Message;

export interface ToLongFingerprint {
  (): string;
}

export interface MessagePartBase {
  // such as "NgExpr", "HtmlTagPair", etc.
  toLongFingerprint: ToLongFingerprint;
}

export class TextPart implements MessagePartBase {
  constructor(public value: string) { }

  // degenerate case.
  toLongFingerprint(): string { return this.value; }
}

export interface Placeholder extends MessagePartBase {
  name: string;
  text: string;
  examples?: string[];
  comment?: string;
}

export class PlaceholderBase implements MessagePartBase {
  constructor(public name: string, public text: string, public examples: string[], public comment: string) {}
  toLongFingerprint(): string { throw Error("You must use a subclass that overrides this method."); }
}

export class NgExpr extends PlaceholderBase {
  // TODO: toLongFingerprint must calcuate this in a proper way.
  toLongFingerprint(): string { return getStableTypeName(this) + this.text; }
}

// TagPairs, when serialized, will use a pair of placeholders to represent
// their begin and end.  TagPairBeginRef and TagPairEndRef represent those placeholders.
export class TagPairRefBase implements Placeholder {
  constructor(public name: string, public text: string, public examples: string[], public comment: string) {}

  // degenerate case.
  toLongFingerprint(): string { return this.text; }
}

export class TagPairBeginRef extends TagPairRefBase {}

export class TagPairEndRef extends TagPairRefBase {}

export class TagPair implements MessagePartBase {
  constructor(
      // tag name: e.g. "span" for the HTML <span> tag.
      public tag: string,
      // original full begin tag with all attributes, etc. as is.
      public begin: string,
      // original full end tag.
      public end: string,
      public parts: ConcreteMessagePart[],
      public examples: string[],
      // canonical_key
      public tagFingerprintLong: string,
      public beginPlaceholderRef: TagPairBeginRef, // ph_begin
      public endPlaceholderRef: TagPairEndRef // ph_end
  ) {}

  // degenerate case.
  toLongFingerprint(): string { return this.tagFingerprintLong; }
}


export class HtmlTagPair extends TagPair {
  // degenerate case.
  toLongFingerprint(): string { return this.tagFingerprintLong; }

  static NewForParsing(
      tag: string,
      begin: string,
      end: string,
      parts: ConcreteMessagePart[],
      examples: string[],
      tagFingerprintLong: string): HtmlTagPair {
    var beginPlaceholderRef = new TagPairBeginRef(
        /* name = */ void 0, // names are resolved much later
        /* text = */ begin,
        /* examples = */ [begin],
        /* comment = */ `Begin HTML <${tag}> tag`
        )
    var endPlaceholderRef = new TagPairEndRef(
        /* name = */ void 0, // names are resolved much later
        /* text = */ end,
        /* examples = */ [end],
        /* comment = */ `End HTML </${tag}> tag`
        )
    return new HtmlTagPair(tag, begin, end, parts, examples,
                           tagFingerprintLong, beginPlaceholderRef, endPlaceholderRef);
  }
}

export type PlaceHoldersMap = Map<string, ConcretePlaceholder>;

export class Message {
  constructor(public id: string,
              public meaning: string,
              public comment: string, /* CKCK: new */
              public parts: ConcreteMessagePart[],
              public placeholdersMap: PlaceHoldersMap) {}
}

export function getStableTypeName(part: SerializableTypes): string {
  var stableTypeName = (<any>part.constructor).$stableTypeName;
  if (stableTypeName === void 0) {
    throw Error(`Internal Error: Trying to get a stable type name for object of type: ${part.constructor}`);
  }
  return stableTypeName;
}


/* These fixed strings have to be stable and are intended to be
 * backwards/forwards compatible.  They are used in the computation of the
 * message fingerprint (for message id) and in the JSON serialization of our
 * messages to disk (potentially used by other file format serializers.)
 *
 * The actual classes that uses these typenames are free to
 * change their names or use inheritance/composition/whatever as long as they
 * eventually identify with one of these types.
 */
export type StableTypeName = string;
export const TYPENAME_TEXT_PART:StableTypeName = "TextPart";
export const TYPENAME_NG_EXPR:StableTypeName = "NgExpr";
export const TYPENAME_TAG_PAIR_BEGIN_REF:StableTypeName = "TagPairBegin";
export const TYPENAME_TAG_PAIR_END_REF:StableTypeName = "TagPairEnd";
export const TYPENAME_HTML_TAG_PAIR:StableTypeName = "HtmlTagPair";
export const TYPENAME_MESSAGE:StableTypeName = "Message";

// This is the set of types that all serializer plugins (file format plugins
// for JSON, XLIFF, etc.) have to support.  This list is available to those
// plugins.  They can choose to throw an Error if a new type they do not
// understand is added to this list.
export const SERIALIZABLE_TYPES = Object.freeze(newSet<Function>([
    TextPart,
    NgExpr,
    TagPairBeginRef,
    TagPairEndRef,
    HtmlTagPair,
    Message
]));

(function init() {
  var typeNamesSeen = new Set<StableTypeName>();
  // The following cast to <any> is required since TypeScript 1.5 does not
  // understand the Set constructor that takes an Array(iterable) as a
  // parameter.  The error we are avoiding is the following:
  // TS2346: Supplied parameters do not match any signature of call target
  var serializableTypes: Set<Function> = new (<any>Set)(SERIALIZABLE_TYPES);

  function registerStableTypeName(ctor, stableTypeName: StableTypeName) {
    if (typeNamesSeen.has(stableTypeName)) {
      throw Error(`Internal Error: Attempting to reuse stable type name: ${stableTypeName}`);
    }
    if (!serializableTypes.has(ctor)) {
      throw Error(`Internal Error: Type ${ctor} is either missing from SERIALIZABLE_TYPES or is registered again.`);
    }
    typeNamesSeen.add(stableTypeName);
    serializableTypes.delete(ctor);
    ctor.$stableTypeName = stableTypeName;
  }

  registerStableTypeName(TextPart, TYPENAME_TEXT_PART);
  registerStableTypeName(NgExpr, TYPENAME_NG_EXPR);
  registerStableTypeName(TagPairBeginRef, TYPENAME_TAG_PAIR_BEGIN_REF);
  registerStableTypeName(TagPairEndRef, TYPENAME_TAG_PAIR_END_REF);
  registerStableTypeName(HtmlTagPair, TYPENAME_HTML_TAG_PAIR);
  registerStableTypeName(Message, TYPENAME_MESSAGE);

  if (typeNamesSeen.size !== SERIALIZABLE_TYPES.size || serializableTypes.size !== 0) {
    throw Error(`Internal Error: Postcondition failed in init()`);
  }
})();


// Support importing from babeljs transpiled files.
export var __esModule = true;
