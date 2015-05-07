'use strict';

var _core = require('babel-runtime/core-js')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

_core.Object.defineProperty(exports, '__esModule', {
  value: true
});

// Returns the root element.
exports.parseHtml = parseHtml;

var _assert = require('assert');

var _assert2 = _interopRequireWildcard(_assert);

var _parse5 = require('parse5');

var _parse52 = _interopRequireWildcard(_parse5);

var _ADAPTER = _parse52['default'].TreeAdapters['default'];

var adapter = _ADAPTER;exports.adapter = adapter;

function parseHtml(html) {
  var parser = new _parse52['default'].Parser(_ADAPTER);
  var root = parser.parse(html);
  // Normally, "root" is the document node and contains the optional doctype
  // node and the HTML node as children.  We'll skip the doctype node and
  // return the only HTML node.
  var elements = (function () {
    var _elements = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _core.getIterator(_ADAPTER.getChildNodes(root)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var child = _step.value;

        if (!_ADAPTER.isDocumentTypeNode(child)) {
          _elements.push(child);
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return _elements;
  })();
  if (elements.length != 1) {
    throw Error('Found more than one element at the root level while parsing HTML text');
  }
  return elements[0];
}

//# sourceMappingURL=parse_html.js.map