"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseMessages = parseMessages;
"use strict";

// For definition of Symbol, etc.
require("babel/polyfill");

var assert = require("assert"),
    util = require("util"),
    fs = require("fs"),
    message_types = require("./message_types.js"),
    treeAdapter = require("./parse_html").adapter,
    PlaceholderRegistry = require("./placeholderRegistry"),
    splitN = require("./stringUtils").splitN,
    quoteHtmlAttribute = require("./quoting").quoteHtmlAttribute,
    fingerprinting = require("./fingerprinting"),
    S = require("string");

function nop() {}

function tobool(o) {
  return o != null && o != "";
}

function ifNull(o, whenNull) {
  return o == null ? whenNull : o;
}

var ParsedComment = function ParsedComment(meaning, comment) {
  _classCallCheck(this, ParsedComment);

  this.meaning = meaning;
  this.comment = comment;
};

function validateValidPlaceholderName(phName) {
  if (phName == null || phName === "") {
    throw Error("invalid placeholder name: " + phName + ": empty name");
  }
  var name = S(phName);
  if (name.startsWith("_") || name.endsWith("_")) {
    throw Error("invalid placeholder name: " + phName + ": should not begin or end with an underscore");
  }
  name = name.replace(/_/g, "");
  if (!name.isAlphaNumeric() || name.toUpperCase().s !== name.s) {
    throw Error("invalid placeholder name: " + phName + ": It may only be composed of capital letters, digits and underscores.");
  }
  if (name.s === "EMBEDDED_MESSAGES") {
    throw Error("invalid placeholder name: " + phName + ": This name is reserved.");
  }
}

function parseRawComment(rawComment) {
  rawComment = rawComment.trim();
  if (rawComment.indexOf("|") == -1) {
    return new ParsedComment(null, rawComment);
  }

  var _ref2 = (function () {
    var _ref = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = splitN(rawComment, "|", 1)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var part = _step.value;

        _ref.push(part.trim());
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"]) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return _ref;
  })();

  var _ref22 = _slicedToArray(_ref2, 2);

  var meaning = _ref22[0];
  var comment = _ref22[1];

  if (meaning === "") {
    throw Error("meaning was explicitly specified but is empty");
  }
  return new ParsedComment(meaning, comment);
}

var NG_EXPR_PH_RE = /i18n-ph\((.*)\)/;
function parseNgExpression(text) {
  var name = null,
      examples = null,
      comment = "Angular Expression";
  // text should not have the {{ }} around it.
  text = text.trim();
  if (text.lastIndexOf("//") == -1) {
    return new message_types.NgExpr(
    /*name=*/name, /*text=*/text, /*examples=*/examples, /*comment=*/comment);
  }
  var parts = splitN(text, "//", 1);
  text = parts[0].trim();
  var rawComment = parts[1].trim();
  var m = NG_EXPR_PH_RE.exec(rawComment);
  if (m == null || m.index != 0) {
    throw Error("Angular expression has a comment but it wasn't valid i18n-ph() syntax");
  }
  var phText = m[1].trim();
  var phName = phText,
      example = null;
  parts = splitN(phText, "|", 1);
  if (parts.length > 1) {
    phName = parts[0].trim();
    example = parts[1].trim();
  }
  validateValidPlaceholderName(phName);
  var examples = example == null ? null : [example];
  return new message_types.NgExpr(
  /*name=*/phName, /*text=*/text, /*examples=*/examples, /*comment=*/comment);
}

var NG_EXPR_RE = /\{\{\s*(.*?)\s*\}\}/;
function parseMessageTextForNgExpressions(text, placeholderRegistry) {
  var parts = [];
  var splits = text.split(NG_EXPR_RE);
  if (splits.length % 2 == 1) {
    // So that our loop can "safely" inspect 2 items at a time.
    splits.push("");
  }
  for (var i = 0; i + 1 < splits.length; i += 2) {
    var txt = splits[i];
    if (txt.length > 0) {
      parts.push(txt);
    }
    var expr = splits[i + 1].trim();
    if (expr.length > 0) {
      var ngExpr = placeholderRegistry.updatePlaceholder(parseNgExpression(expr));
      parts.push(ngExpr);
    }
  }
  return parts;
}

function _serializeHtmlAttr(name, value) {
  return value == null ? name : "" + name + "=" + quoteHtmlAttribute(value);
}

function _getSerializedAttrs(node) {
  var serializedAttrs = [];
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = ifNull(treeAdapter.getAttrList(node), [])[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var attr = _step2.value;

      serializedAttrs.push(_serializeHtmlAttr(attr.name, attr.value));
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return serializedAttrs.join(" ");
}

function _getHtmlBeginEndTags(node) {
  var serializedAttrs = _getSerializedAttrs(node);
  if (serializedAttrs !== "") {
    serializedAttrs = " " + serializedAttrs;
  }
  var tag = treeAdapter.getTagName(node);
  var begin = "<" + tag + "" + serializedAttrs + ">";
  var end = "</" + tag + ">";
  return { begin: begin, end: end };
}

function _parseNode(node, placeholderRegistry) {
  if (treeAdapter.isTextNode(node)) {
    return parseMessageTextForNgExpressions(treeAdapter.getTextNodeContent(node), placeholderRegistry);
  }
  var parts = [];
  function extendParts(extra) {
    extra.forEach(function (value) {
      return parts.push(value);
    });
  }
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = treeAdapter.getChildNodes(node)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var child = _step3.value;

      extendParts(_parseNode(child, placeholderRegistry));
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
        _iterator3["return"]();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  var canonicalKey = placeholderRegistry.reserveNewTag(treeAdapter.getTagName(node));
  var beginEndTags = _getHtmlBeginEndTags(node);
  var tagPair = message_types.HtmlTagPair.NewForParsing(
  /*tag=*/treeAdapter.getTagName(node),
  /*begin=*/beginEndTags.begin,
  /*end=*/beginEndTags.end,
  /*parts=*/parts,
  /*examples=*/null,
  /*tagFingerprintLong=*/canonicalKey);
  return [placeholderRegistry.updatePlaceholder(tagPair)];
}

function parseNodeContents(root, placeholderRegistry) {
  var parts = [];
  function extendParts(extra) {
    extra.forEach(function (value) {
      return parts.push(value);
    });
  }
  ifNull(treeAdapter.getChildNodes(root), []).forEach(function (childNode) {
    return extendParts(_parseNode(childNode, placeholderRegistry));
  });
  return parts;
}

var MessageBuilder = (function () {
  function MessageBuilder(rawComment, rawMessage, parent) {
    _classCallCheck(this, MessageBuilder);

    this.parent = parent;
    var parsedComment = parseRawComment(rawComment);
    this.meaning = parsedComment.meaning;
    this.comment = parsedComment.comment;
    //ckck// this.placeholderRegistry = (parent ? parent.placeholderRegistry : new PlaceholderRegistry());
    this.placeholderRegistry = new PlaceholderRegistry();
    if (typeof rawMessage === "string") {
      this.parts = parseMessageTextForNgExpressions(rawMessage, this.placeholderRegistry);
    } else {
      this.parts = parseNodeContents(rawMessage, this.placeholderRegistry);
    };
  }

  _createClass(MessageBuilder, [{
    key: "build",
    value: function build() {
      var id = fingerprinting.computeIdForMessageBuilder(this);
      var placeholdersByName = this.placeholderRegistry.toMap();
      return new message_types.Message( /*id=*/id,
      /*meaning=*/this.meaning,
      /*comment=*/this.comment,
      /*parts=*/this.parts,
      /*placeholdersByName=*/placeholdersByName);
    }
  }]);

  return MessageBuilder;
})();

var I18N_ATTRIB_PREFIX = "i18n-";

var _dummyOnParse = {
  onAttrib: nop,
  onNode: nop
};

function _findAttrib(node, attrName) {
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = ifNull(treeAdapter.getAttrList(node), [])[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var attr = _step4.value;

      if (attr.name === attrName) {
        return attr;
      }
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4["return"]) {
        _iterator4["return"]();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  return null;
}

var MessageParser = (function () {
  function MessageParser(onParse) {
    _classCallCheck(this, MessageParser);

    this.onParse = onParse;
    this.nodes = [];
    this.messages = {};
  }

  _createClass(MessageParser, [{
    key: "_parseI18nAttribs",
    value: function _parseI18nAttribs(node) {
      var attrList = treeAdapter.getAttrList(node);
      if (attrList == null || attrList.length == 0) {
        return;
      }
      var i18nAttribs = [];
      var valuesByName = new Map();
      attrList.forEach(function (attr) {
        valuesByName.set(attr.name, attr.value);
        if (attr.name.indexOf(I18N_ATTRIB_PREFIX) == 0) {
          i18nAttribs.push(attr);
        }
      });
      if (i18nAttribs.length == 0) {
        return;
      }
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = i18nAttribs[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var i18nAttr = _step5.value;

          var attrName = i18nAttr.name.substr(I18N_ATTRIB_PREFIX.length);
          var rawMessage = valuesByName.get(attrName);
          var message = new MessageBuilder( /*rawComment=*/i18nAttr.value, /*rawMessage*/rawMessage).build();
          this.messages[message.id] = message;
          this.onParse.onAttrib(message, node, attrName);
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5["return"]) {
            _iterator5["return"]();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    }
  }, {
    key: "_parseMessagesInI18nNode",

    // Returns true if this was an i18n node and false otherwise.
    value: function _parseMessagesInI18nNode(node) {
      var i18nAttr = _findAttrib(node, "i18n");
      if (i18nAttr == null) {
        return false;
      }
      var message = new MessageBuilder( /*rawComment=*/i18nAttr.value, /*rawMessage*/node).build();
      this.messages[message.id] = message;
      this.onParse.onNode(message, node);
      return true;
    }
  }, {
    key: "parseMessages",
    value: function parseMessages(root) {
      this.nodes.push(root);
      while (this.nodes.length > 0) {
        var node = this.nodes.shift();
        this._parseI18nAttribs(node);
        if (!this._parseMessagesInI18nNode(node)) {
          // Not an i18n node so we should descend into it.
          var childNodes = treeAdapter.getChildNodes(node);
          if (tobool(childNodes)) {
            this.nodes.unshift.apply(this.nodes, childNodes);
          }
        }
      }
    }
  }]);

  return MessageParser;
})();

function parseMessages(rootNode, /* optional */onParse) {
  if (onParse == null) {
    onParse = _dummyOnParse;
  }
  var parser = new MessageParser(onParse);
  parser.parseMessages(rootNode);
  return parser.messages;
}

//# sourceMappingURL=parse_messages.js.map