var M = require('../message_types');
var serializer_1 = require('../serializer');
// new Set(array) helper.
var newSet_1 = require('./../newSet');
/**
 * Overview of how we serialize to JSON
 *
 * TODO(chirayu): Fill this section out.
 *   explain message_types vs pojo_types
 */
function freeze(obj) { return Object.freeze(obj); }
var SERIALIZABLE_TYPES = Object.freeze(newSet_1.default([
    M.TextPart, M.NgExpr, M.TagPairBeginRef, M.TagPairEndRef, M.HtmlTagPair, M.Message]));
function textPartToPojo(part) {
    return {
        $stableTypeName: M.getStableTypeName(part),
        value: part.value
    };
}
function textPartFromPojo(pojo) {
    return new M.TextPart(pojo.value);
}
function _placeholderToPojo(part) {
    return {
        $stableTypeName: M.getStableTypeName(part),
        name: part.name,
        text: part.text,
        examples: part.examples,
        comment: part.comment
    };
}
function ngExprToPojo(part) {
    return _placeholderToPojo(part);
}
function ngExprFromPojo(pojo) {
    return new M.NgExpr(pojo.name, pojo.text, pojo.examples, pojo.comment);
}
function beginPlaceholderRefToPojo(part) {
    return _placeholderToPojo(part);
}
function beginPlaceholderRefFromPojo(pojo) {
    return new M.TagPairBeginRef(pojo.name, pojo.text, pojo.examples, pojo.comment);
}
function endPlaceholderRefToPojo(part) {
    return _placeholderToPojo(part);
}
function endPlaceholderRefFromPojo(pojo) {
    return new M.TagPairEndRef(pojo.name, pojo.text, pojo.examples, pojo.comment);
}
function partsToPojo(parts) {
    var results = [];
    parts.forEach(function (part) {
        results.push(toPojo(part));
    });
    return results;
}
function partsFromPojo(pojos) {
    var parts = [];
    pojos.forEach(function (pojo) {
        parts.push(fromPojo(pojo));
    });
    return parts;
}
function htmlTagPairToPojo(htmlTagPair) {
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
function htmlTagPairFromPojo(pojo) {
    return new M.HtmlTagPair(pojo.tag, pojo.begin, pojo.end, partsFromPojo(pojo.parts), pojo.examples, pojo.tagFingerprintLong, beginPlaceholderRefFromPojo(pojo.beginPlaceholderRef), endPlaceholderRefFromPojo(pojo.endPlaceholderRef));
}
function placeholdersMapToPojo(placeholdersMap) {
    var results = {};
    placeholdersMap.forEach(function (placeholder, key) {
        results[key] = toPojo(placeholder);
    });
    return results;
}
function placeholdersMapFromPojo(pojos) {
    var placeholdersMap = new Map();
    Object.keys(pojos).forEach(function (key) {
        var placeholder = fromPojo(pojos[key]);
        placeholdersMap.set(key, placeholder);
    });
    return placeholdersMap;
}
function messageToPojo(msg) {
    return {
        $stableTypeName: M.getStableTypeName(msg),
        id: msg.id,
        meaning: msg.meaning,
        comment: msg.comment,
        parts: partsToPojo(msg.parts),
        placeholdersMap: placeholdersMapToPojo(msg.placeholdersMap)
    };
}
function messageFromPojo(pojo) {
    return new M.Message(pojo.id, pojo.meaning, pojo.comment, partsFromPojo(pojo.parts), placeholdersMapFromPojo(pojo.placeholdersMap));
}
function toPojo(obj) {
    var stableTypeName = M.getStableTypeName(obj);
    switch (stableTypeName) {
        case M.TYPENAME_TEXT_PART:
            return textPartToPojo(obj);
        case M.TYPENAME_NG_EXPR:
            return ngExprToPojo(obj);
        case M.TYPENAME_TAG_PAIR_BEGIN_REF:
            return beginPlaceholderRefToPojo(obj);
        case M.TYPENAME_TAG_PAIR_END_REF:
            return endPlaceholderRefToPojo(obj);
        case M.TYPENAME_HTML_TAG_PAIR:
            return htmlTagPairToPojo(obj);
        case M.TYPENAME_MESSAGE:
            return messageToPojo(obj);
        default: throw Error("Error: Don't know how to serialize type " + stableTypeName);
    }
}
function fromPojo(obj) {
    var stableTypeName = obj.$stableTypeName;
    switch (stableTypeName) {
        case M.TYPENAME_TEXT_PART:
            return textPartFromPojo(obj);
        case M.TYPENAME_NG_EXPR:
            return ngExprFromPojo(obj);
        case M.TYPENAME_TAG_PAIR_BEGIN_REF:
            return beginPlaceholderRefFromPojo(obj);
        case M.TYPENAME_TAG_PAIR_END_REF:
            return endPlaceholderRefFromPojo(obj);
        case M.TYPENAME_HTML_TAG_PAIR:
            return htmlTagPairFromPojo(obj);
        case M.TYPENAME_MESSAGE:
            return messageFromPojo(obj);
        default:
            throw Error("Error: Don't know how to serialize type " + stableTypeName);
    }
}
var JsonSerializer = (function () {
    function JsonSerializer() {
    }
    JsonSerializer.prototype.stringify = function (obj) {
        return JSON.stringify(toPojo(obj), null, 4);
    };
    JsonSerializer.prototype.parse = function (s) {
        return fromPojo(JSON.parse(s));
    };
    return JsonSerializer;
})();
function newSerializer() {
    if (arguments.length == 0) {
        return new JsonSerializer();
    }
    throw Error("Error: JSON serializer is not configurable.");
}
function verifyCompatibleSerializableTypes() {
    if (SERIALIZABLE_TYPES.size !== M.SERIALIZABLE_TYPES.size) {
        throw Error("Internal Error: This version of the JSON serializer is incompatible with the version of message_types.ts");
    }
    var numInBoth = 0;
    M.SERIALIZABLE_TYPES.forEach(function (ctor) {
        numInBoth += SERIALIZABLE_TYPES.has(ctor) ? 1 : 0;
    });
    if (numInBoth !== SERIALIZABLE_TYPES.size) {
        throw Error("Internal Error: This version of the JSON serializer is incompatible with the version of message_types.ts");
    }
}
function init() {
    verifyCompatibleSerializableTypes();
    serializer_1.default.register("json", newSerializer);
}
exports.default = init;
//# sourceMappingURL=internalJson.js.map