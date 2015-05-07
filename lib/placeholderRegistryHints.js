'use strict';

var _core = require('babel-runtime/core-js')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

_core.Object.defineProperty(exports, '__esModule', {
  value: true
});

exports.getNameHintForPlaceholder = getNameHintForPlaceholder;

var _import = require('./message_types');

var M = _interopRequireWildcard(_import);

var getNameHintForHtmlTag = require('./placeholderRegistryHintsForHtmlTags').getNameHintForHtmlTag;

function getNameHintForPlaceholder(placeholder) {
  if (placeholder instanceof M.TagPair) {
    var typeName = M.getStableTypeName(placeholder);
    switch (typeName) {
      case M.TYPENAME_HTML_TAG_PAIR:
        return getNameHintForHtmlTag(placeholder.tag);
      default:
        // NOTE: If/When we support different tag types, we want to come up with
        // a sane system of naming the generated placeholders instead of
        // generating one automatically here.  By throwing an error here, we
        // force ourselves to revisit this code and pick a good naming scheme.
        throw Error('InternalError: Placeholder hints for tags of type "' + typeName + '" are not yet implemented.');
    }
  } else {
    return placeholder instanceof M.NgExpr ? 'EXPRESSION' : 'PH';
  }
}

//# sourceMappingURL=placeholderRegistryHints.js.map