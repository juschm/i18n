/// <reference path="collections.d.ts" />
export declare type AbstractMessagePart = TextPart | Placeholder | TagPair;
export declare type ConcretePlaceholder = NgExpr | TagPairBeginRef | TagPairEndRef;
export declare type ConcreteTagPair = HtmlTagPair;
export declare type ConcreteMessagePart = TextPart | ConcretePlaceholder | ConcreteTagPair;
export declare type SerializableTypes = ConcreteMessagePart | Message;
export interface ToLongFingerprint {
    (): string;
}
export interface MessagePartBase {
    toLongFingerprint: ToLongFingerprint;
}
export declare class TextPart implements MessagePartBase {
    value: string;
    constructor(value: string);
    toLongFingerprint(): string;
}
export interface Placeholder extends MessagePartBase {
    name: string;
    text: string;
    examples?: string[];
    comment?: string;
}
export declare class PlaceholderBase implements MessagePartBase {
    name: string;
    text: string;
    examples: string[];
    comment: string;
    constructor(name: string, text: string, examples: string[], comment: string);
    toLongFingerprint(): string;
}
export declare class NgExpr extends PlaceholderBase {
    toLongFingerprint(): string;
}
export declare class TagPairRefBase implements Placeholder {
    name: string;
    text: string;
    examples: string[];
    comment: string;
    constructor(name: string, text: string, examples: string[], comment: string);
    toLongFingerprint(): string;
}
export declare class TagPairBeginRef extends TagPairRefBase {
}
export declare class TagPairEndRef extends TagPairRefBase {
}
export declare class TagPair implements MessagePartBase {
    tag: string;
    begin: string;
    end: string;
    parts: ConcreteMessagePart[];
    examples: string[];
    tagFingerprintLong: string;
    beginPlaceholderRef: TagPairBeginRef;
    endPlaceholderRef: TagPairEndRef;
    constructor(tag: string, begin: string, end: string, parts: ConcreteMessagePart[], examples: string[], tagFingerprintLong: string, beginPlaceholderRef: TagPairBeginRef, endPlaceholderRef: TagPairEndRef);
    toLongFingerprint(): string;
}
export declare class HtmlTagPair extends TagPair {
    toLongFingerprint(): string;
    static NewForParsing(tag: string, begin: string, end: string, parts: ConcreteMessagePart[], examples: string[], tagFingerprintLong: string): HtmlTagPair;
}
export declare type PlaceHoldersMap = Map<string, ConcretePlaceholder>;
export declare class Message {
    id: string;
    meaning: string;
    comment: string;
    parts: ConcreteMessagePart[];
    placeholdersMap: PlaceHoldersMap;
    constructor(id: string, meaning: string, comment: string, parts: ConcreteMessagePart[], placeholdersMap: PlaceHoldersMap);
}
export declare function getStableTypeName(part: SerializableTypes): string;
export declare type StableTypeName = string;
export declare const TYPENAME_TEXT_PART: StableTypeName;
export declare const TYPENAME_NG_EXPR: StableTypeName;
export declare const TYPENAME_TAG_PAIR_BEGIN_REF: StableTypeName;
export declare const TYPENAME_TAG_PAIR_END_REF: StableTypeName;
export declare const TYPENAME_HTML_TAG_PAIR: StableTypeName;
export declare const TYPENAME_MESSAGE: StableTypeName;
export declare const SERIALIZABLE_TYPES: Set<Function>;
export declare var __esModule: boolean;
