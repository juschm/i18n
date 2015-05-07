'use strict';

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

// Returns the root element.
exports.parseHtml = parseHtml;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _parse5 = require('parse5');

var _parse52 = _interopRequireDefault(_parse5);

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
      for (var _iterator = _getIterator(_ADAPTER.getChildNodes(root)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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