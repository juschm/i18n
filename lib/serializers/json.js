///<reference path='../../typings/node/node.d.ts'/>
var assert = require('assert');
var M = require('../message_types');
var serializer_1 = require('../serializer');
// new Set(array) helper.
var newSet_1 = require('./../newSet');
function textPartToPojo(part) {
    return part.value;
}
function textPartFromPojo(pojo) {
    return new M.TextPart(pojo);
}
function _placeholderToPojo(part) {
    return {
        $type: M.getStableTypeName(part),
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
        results.push(messagePartToPojo(part));
    });
    return results;
}
function messagePartToPojo(obj) {
    var stableTypeName = M.getStableTypeName(obj);
    if (obj instanceof M.TextPart) {
        assert(stableTypeName === M.TYPENAME_TEXT_PART);
        return textPartToPojo(obj);
    }
    else if (obj instanceof M.NgExpr || obj instanceof M.TagPairBeginRef || obj instanceof M.TagPairEndRef) {
        assert(stableTypeName === M.TYPENAME_NG_EXPR || stableTypeName === M.TYPENAME_TAG_PAIR_BEGIN_REF || stableTypeName === M.TYPENAME_TAG_PAIR_END_REF);
        return placeholderToNamePojo(obj);
    }
    else if (obj instanceof M.HtmlTagPair) {
        assert(stableTypeName === M.TYPENAME_HTML_TAG_PAIR);
        return htmlTagPairToPojo(obj);
    }
    else {
        throw Error("Error: Don't know how to serialize type " + stableTypeName);
    }
}
function messagePartFromPojo(obj, placeholdersMap) {
    if (typeof obj === 'string') {
        return textPartFromPojo(obj);
    }
    else if (obj instanceof Array) {
        return placeholderFromNamePojo(obj, placeholdersMap);
    }
    else {
        assert(obj.$type === M.TYPENAME_HTML_TAG_PAIR);
        return htmlTagPairFromPojo(obj, placeholdersMap);
    }
}
function placeholderToNamePojo(obj) {
    return [obj.name];
}
function placeholderFromNamePojo(obj, placeholdersMap) {
    var name = obj[0];
    assert(placeholdersMap.has(name));
    return placeholdersMap.get(name);
}
function messagePartsFromPojo(pojos, placeholdersMap) {
    var parts = [];
    pojos.forEach(function (pojo) {
        parts.push(messagePartFromPojo(pojo, placeholdersMap));
    });
    return parts;
}
function htmlTagPairToPojo(htmlTagPair) {
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
function htmlTagPairFromPojo(pojo, phMap) {
    return new M.HtmlTagPair(pojo.tag, pojo.begin, pojo.end, messagePartsFromPojo(pojo.parts, phMap), pojo.examples, pojo.tagFingerprintLong, placeholderFromNamePojo(pojo.beginPlaceholderRef, phMap), placeholderFromNamePojo(pojo.endPlaceholderRef, phMap));
}
function placeholdersMapToPojo(placeholdersMap) {
    var results = {};
    placeholdersMap.forEach(function (placeholder, key) {
        results[key] = placeholderToPojo(placeholder);
    });
    return results;
}
function placeholdersMapFromPojo(pojos) {
    var placeholdersMap = new Map();
    Object.keys(pojos).forEach(function (key) {
        var placeholder = placeholderFromPojo(pojos[key]);
        placeholdersMap.set(key, placeholder);
    });
    return placeholdersMap;
}
function messageToPojo(msg) {
    return {
        $type: M.getStableTypeName(msg),
        id: msg.id,
        meaning: msg.meaning,
        comment: msg.comment,
        parts: partsToPojo(msg.parts),
        placeholdersMap: placeholdersMapToPojo(msg.placeholdersMap)
    };
}
function messageFromPojo(pojo) {
    assert(pojo.$type === M.TYPENAME_MESSAGE);
    var placeholdersMap = placeholdersMapFromPojo(pojo.placeholdersMap);
    return new M.Message(pojo.id, pojo.meaning, pojo.comment, messagePartsFromPojo(pojo.parts, placeholdersMap), placeholdersMap);
}
function placeholderToPojo(obj) {
    var stableTypeName = M.getStableTypeName(obj);
    switch (stableTypeName) {
        case M.TYPENAME_NG_EXPR:
            return ngExprToPojo(obj);
        case M.TYPENAME_TAG_PAIR_BEGIN_REF:
            return beginPlaceholderRefToPojo(obj);
        case M.TYPENAME_TAG_PAIR_END_REF:
            return endPlaceholderRefToPojo(obj);
        default: throw Error("Error: Don't know how to serialize type " + stableTypeName);
    }
}
function placeholderFromPojo(obj) {
    var stableTypeName = obj.$type;
    switch (stableTypeName) {
        case M.TYPENAME_NG_EXPR:
            return ngExprFromPojo(obj);
        case M.TYPENAME_TAG_PAIR_BEGIN_REF:
            return beginPlaceholderRefFromPojo(obj);
        case M.TYPENAME_TAG_PAIR_END_REF:
            return endPlaceholderRefFromPojo(obj);
        default:
            throw Error("Error: Don't know how to de-serialize type " + stableTypeName);
    }
}
var JsonSerializer = (function () {
    function JsonSerializer() {
    }
    JsonSerializer.prototype.stringify = function (obj) {
        assert(M.getStableTypeName(obj) === M.TYPENAME_MESSAGE);
        return JSON.stringify(messageToPojo(obj), null, 4);
    };
    JsonSerializer.prototype.parse = function (s) {
        return messageFromPojo(JSON.parse(s));
    };
    return JsonSerializer;
})();
function newSerializer() {
    if (arguments.length == 0) {
        return new JsonSerializer();
    }
    throw Error("Error: JSON serializer is not configurable.");
}
var SERIALIZABLE_TYPES = Object.freeze(newSet_1.default([
    M.TextPart, M.NgExpr, M.TagPairBeginRef, M.TagPairEndRef, M.HtmlTagPair, M.Message]));
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
//# sourceMappingURL=json.js.map