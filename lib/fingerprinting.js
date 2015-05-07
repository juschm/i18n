'use strict';

var _Object$defineProperty = require('babel-runtime/core-js/object/define-property')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _Map = require('babel-runtime/core-js/map')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

_Object$defineProperty(exports, '__esModule', {
  value: true
});

exports.computeIdForMessageBuilder = computeIdForMessageBuilder;
var marked0$0 = [_genIdParts, _genIdPartsForSubparts].map(_regeneratorRuntime.mark);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _message_types = require('./message_types');

var M = _interopRequireWildcard(_message_types);

var _hashing = require('./hashing');

var _string = require('string');

var _string2 = _interopRequireDefault(_string);

// Escape sequences for fingerprinting.
// Fingerprinting requires unique digests for unique messages.  The approach is
// to construct a unique long string for unique messages and use a fixed and
// good fingerprinting algorithm to get a smaller digest out of it (64/128 bits
// should be sufficient.)  These escape sequences are used in generating the
// unique long string per message.
var ESCAPE_CHAR = '\u0010';
var ESCAPE_CHAR_RE = new RegExp(ESCAPE_CHAR, 'g');
var ESCAPE_END = ESCAPE_CHAR + '.';
var BEGIN_TEXT = ESCAPE_CHAR + '\'';
var BEGIN_PH = ESCAPE_CHAR + 'X';
var BEGIN_TAG = ESCAPE_CHAR + '<';
var END_TAG = ESCAPE_CHAR + '>';

function _escapeTextForMessageId(text) {
  return text.replace(ESCAPE_CHAR_RE, ESCAPE_CHAR + ESCAPE_CHAR);
}

function computeIdForMessageBuilder(msgBuilder) {
  var hasher = new _hashing.SHA1();
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = _getIterator(_genIdParts(msgBuilder)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var part = _step.value;

      hasher.update(part);
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

  return hasher.hexdigest();
}

function _genIdParts(msgBuilder) {
  var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, i;

  return _regeneratorRuntime.wrap(function _genIdParts$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _escapeTextForMessageId(msgBuilder.meaning || '');

      case 2:
        _iteratorNormalCompletion2 = true;
        _didIteratorError2 = false;
        _iteratorError2 = undefined;
        context$1$0.prev = 5;
        _iterator2 = _getIterator(_genIdPartsForSubparts(msgBuilder.parts));

      case 7:
        if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
          context$1$0.next = 14;
          break;
        }

        i = _step2.value;
        context$1$0.next = 11;
        return i;

      case 11:
        _iteratorNormalCompletion2 = true;
        context$1$0.next = 7;
        break;

      case 14:
        context$1$0.next = 20;
        break;

      case 16:
        context$1$0.prev = 16;
        context$1$0.t0 = context$1$0['catch'](5);
        _didIteratorError2 = true;
        _iteratorError2 = context$1$0.t0;

      case 20:
        context$1$0.prev = 20;
        context$1$0.prev = 21;

        if (!_iteratorNormalCompletion2 && _iterator2['return']) {
          _iterator2['return']();
        }

      case 23:
        context$1$0.prev = 23;

        if (!_didIteratorError2) {
          context$1$0.next = 26;
          break;
        }

        throw _iteratorError2;

      case 26:
        return context$1$0.finish(23);

      case 27:
        return context$1$0.finish(20);

      case 28:
      case 'end':
        return context$1$0.stop();
    }
  }, marked0$0[0], this, [[5, 16, 20, 28], [21,, 23, 27]]);
}

function _genIdPartsForSubparts(parts) {
  var placeholders, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, part, i, placeholderNames, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _name, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, _name2, placeholder;

  return _regeneratorRuntime.wrap(function _genIdPartsForSubparts$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        placeholders = new _Map();
        _iteratorNormalCompletion3 = true;
        _didIteratorError3 = false;
        _iteratorError3 = undefined;
        context$1$0.prev = 4;
        _iterator3 = _getIterator(parts);

      case 6:
        if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
          context$1$0.next = 33;
          break;
        }

        part = _step3.value;

        if (!(part instanceof M.TextPart)) {
          context$1$0.next = 13;
          break;
        }

        context$1$0.next = 11;
        return '' + BEGIN_TEXT + '' + _escapeTextForMessageId(part.value) + '' + ESCAPE_END;

      case 11:
        context$1$0.next = 30;
        break;

      case 13:
        if (!(part instanceof M.PlaceholderBase)) {
          context$1$0.next = 17;
          break;
        }

        placeholders.set(part.name, part);
        context$1$0.next = 30;
        break;

      case 17:
        if (!(part instanceof M.TagPair)) {
          context$1$0.next = 29;
          break;
        }

        context$1$0.next = 20;
        return '' + BEGIN_TAG + '' + part.beginPlaceholderRef.name + ',' + M.getStableTypeName(part) + '' + ESCAPE_END;

      case 20:
        context$1$0.t1 = _regeneratorRuntime.keys(_genIdPartsForSubparts(part.parts));

      case 21:
        if ((context$1$0.t2 = context$1$0.t1()).done) {
          context$1$0.next = 27;
          break;
        }

        i = context$1$0.t2.value;
        context$1$0.next = 25;
        return i;

      case 25:
        context$1$0.next = 21;
        break;

      case 27:
        context$1$0.next = 30;
        break;

      case 29:
        throw Error('Encountered unknown message part type while computing message ID: ' + M.getStableTypeName(part));

      case 30:
        _iteratorNormalCompletion3 = true;
        context$1$0.next = 6;
        break;

      case 33:
        context$1$0.next = 39;
        break;

      case 35:
        context$1$0.prev = 35;
        context$1$0.t3 = context$1$0['catch'](4);
        _didIteratorError3 = true;
        _iteratorError3 = context$1$0.t3;

      case 39:
        context$1$0.prev = 39;
        context$1$0.prev = 40;

        if (!_iteratorNormalCompletion3 && _iterator3['return']) {
          _iterator3['return']();
        }

      case 42:
        context$1$0.prev = 42;

        if (!_didIteratorError3) {
          context$1$0.next = 45;
          break;
        }

        throw _iteratorError3;

      case 45:
        return context$1$0.finish(42);

      case 46:
        return context$1$0.finish(39);

      case 47:
        placeholderNames = [];
        _iteratorNormalCompletion4 = true;
        _didIteratorError4 = false;
        _iteratorError4 = undefined;
        context$1$0.prev = 51;

        for (_iterator4 = _getIterator(placeholders.keys()); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          _name = _step4.value;

          placeholderNames.push(_name);
        }
        context$1$0.next = 59;
        break;

      case 55:
        context$1$0.prev = 55;
        context$1$0.t4 = context$1$0['catch'](51);
        _didIteratorError4 = true;
        _iteratorError4 = context$1$0.t4;

      case 59:
        context$1$0.prev = 59;
        context$1$0.prev = 60;

        if (!_iteratorNormalCompletion4 && _iterator4['return']) {
          _iterator4['return']();
        }

      case 62:
        context$1$0.prev = 62;

        if (!_didIteratorError4) {
          context$1$0.next = 65;
          break;
        }

        throw _iteratorError4;

      case 65:
        return context$1$0.finish(62);

      case 66:
        return context$1$0.finish(59);

      case 67:
        placeholderNames.sort();
        _iteratorNormalCompletion5 = true;
        _didIteratorError5 = false;
        _iteratorError5 = undefined;
        context$1$0.prev = 71;
        _iterator5 = _getIterator(placeholderNames);

      case 73:
        if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
          context$1$0.next = 81;
          break;
        }

        _name2 = _step5.value;
        placeholder = placeholders.get(_name2);
        context$1$0.next = 78;
        return '' + BEGIN_PH + '' + _name2 + ',' + M.getStableTypeName(placeholder) + '' + ESCAPE_END;

      case 78:
        _iteratorNormalCompletion5 = true;
        context$1$0.next = 73;
        break;

      case 81:
        context$1$0.next = 87;
        break;

      case 83:
        context$1$0.prev = 83;
        context$1$0.t5 = context$1$0['catch'](71);
        _didIteratorError5 = true;
        _iteratorError5 = context$1$0.t5;

      case 87:
        context$1$0.prev = 87;
        context$1$0.prev = 88;

        if (!_iteratorNormalCompletion5 && _iterator5['return']) {
          _iterator5['return']();
        }

      case 90:
        context$1$0.prev = 90;

        if (!_didIteratorError5) {
          context$1$0.next = 93;
          break;
        }

        throw _iteratorError5;

      case 93:
        return context$1$0.finish(90);

      case 94:
        return context$1$0.finish(87);

      case 95:
      case 'end':
        return context$1$0.stop();
    }
  }, marked0$0[1], this, [[4, 35, 39, 47], [40,, 42, 46], [51, 55, 59, 67], [60,, 62, 66], [71, 83, 87, 95], [88,, 90, 94]]);
}

//# sourceMappingURL=fingerprinting.js.map