'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _core = require('babel-runtime/core-js')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

_core.Object.defineProperty(exports, '__esModule', {
  value: true
});

var _import = require('./message_types');

var M = _interopRequireWildcard(_import);

var _LoadingCache = require('./LoadingCache');

var _Counter = require('./Counter');

var _Counter2 = _interopRequireWildcard(_Counter);

var _getNameHintForPlaceholder = require('./placeholderRegistryHints');

if (true + true !== 2 || false + false !== 0) {
  throw Error('Internal Error: Please file an issue on GitHub with this stacktrace.');
}

function toBool(x) {
  return x ? true : false;
}

var PlaceholderRegistry = (function () {
  function PlaceholderRegistry() {
    _classCallCheck(this, PlaceholderRegistry);

    this._namesSeen = new _core.Set();
    // We require an ordered Map.  ES6 Map's iterate in insertion order (Map.forEach)
    // so we can simply use Map.
    // Refer section 23.1.3.5 of the draft spec.
    // http://people.mozilla.org/~jorendorff/es6-draft.html#sec-map.prototype.foreach
    this._byFingerprint = new _core.Map();
    this._countsByPrefix = new _LoadingCache.LoadingCache(function (key) {
      return new _Counter2['default'](1);
    });
    this._counter = new _Counter2['default'](1);
  }

  _createClass(PlaceholderRegistry, [{
    key: 'toMap',
    value: function toMap() {
      var self = this;
      this._byFingerprint.forEach(function (placeholderOrTag) {
        return self._ensureName(placeholderOrTag);
      });
      var result = new _core.Map();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _core.getIterator(this._byFingerprint.values()), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var placeholderOrTag = _step.value;

          if (placeholderOrTag instanceof M.PlaceholderBase) {
            result.set(placeholderOrTag.name, placeholderOrTag);
          } else if (placeholderOrTag instanceof M.TagPair) {
            var tag_pair = placeholderOrTag;
            result.set(tag_pair.beginPlaceholderRef.name, tag_pair.beginPlaceholderRef);
            result.set(tag_pair.endPlaceholderRef.name, tag_pair.endPlaceholderRef);
          } else {
            throw Error('Internal Error');
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

      return result;
    }
  }, {
    key: '_ensureNamesForTag',
    value: function _ensureNamesForTag(placeholder) {
      if (placeholder.beginPlaceholderRef.name) {
        return;
      }
      var nameHint = _getNameHintForPlaceholder.getNameHintForPlaceholder(placeholder);
      var beginBasename = nameHint + '_BEGIN',
          endBasename = nameHint + '_END',
          phBeginName = beginBasename,
          phEndName = endBasename,
          counter = this._countsByPrefix.get(beginBasename);
      while (this._namesSeen.has(phBeginName) || this._namesSeen.has(phEndName)) {
        var count = counter.next();
        phBeginName = '' + beginBasename + '_' + count;
        phEndName = '' + endBasename + '_' + count;
      }
      this._namesSeen.add(phBeginName);
      this._namesSeen.add(phEndName);
      placeholder.beginPlaceholderRef.name = phBeginName;
      placeholder.endPlaceholderRef.name = phEndName;
    }
  }, {
    key: 'ensureNameForPlaceholder',
    value: function ensureNameForPlaceholder(placeholder) {
      if (placeholder.name) {
        return;
      }
      var basename = _getNameHintForPlaceholder.getNameHintForPlaceholder(placeholder),
          name = basename;
      var counter = this._countsByPrefix.get(basename);
      while (this._namesSeen.has(name)) {
        name = '' + basename + '_' + counter.next();
      }
      this._namesSeen.add(name);
      placeholder.name = name;
    }
  }, {
    key: '_ensureName',
    value: function _ensureName(placeholder) {
      if (placeholder instanceof M.TagPair) {
        this._ensureNamesForTag(placeholder);
      } else {
        this.ensureNameForPlaceholder(placeholder);
      }
    }
  }, {
    key: 'reserveNewTag',
    value: function reserveNewTag(tagName) {
      var canonicalKey = 'TAG_' + tagName + '_' + this._counter.next();
      this._byFingerprint.set(canonicalKey, null);
      return canonicalKey;
    }
  }, {
    key: 'updatePlaceholder',
    value: function updatePlaceholder(placeholder) {
      if (placeholder instanceof M.TagPair) {
        return this._updateTagPlaceholder(placeholder);
      } else {
        return this._updateSimplePlaceholder(placeholder);
      }
    }
  }, {
    key: '_updateTagPlaceholder',
    value: function _updateTagPlaceholder(placeholder) {
      var canonicalKey = placeholder.toLongFingerprint();
      this._byFingerprint.set(canonicalKey, placeholder);
      return placeholder;
    }
  }, {
    key: '_updateSimplePlaceholder',
    value: function _updateSimplePlaceholder(placeholder) {
      var canonicalKey = placeholder.toLongFingerprint();
      var existingPlaceholder = this._byFingerprint.get(canonicalKey);
      if (existingPlaceholder !== void 0) {
        var numNames = toBool(placeholder.name) + toBool(existingPlaceholder.name);
        if (numNames === 2) {
          if (placeholder.name != existingPlaceholder.name) {
            throw Error('The same placeholder occurs more than once with a different placeholder name.');
          }
        } else if (numNames == 1) {
          if (placeholder.name == null) {
            placeholder.name = existingPlaceholder.name;
          } else {
            existingPlaceholder.name = placeholder.name;
          }
        }
      } else {
        this._byFingerprint.set(canonicalKey, placeholder);
      }
      return placeholder;
    }
  }]);

  return PlaceholderRegistry;
})();

exports['default'] = PlaceholderRegistry;
module.exports = exports['default'];

//# sourceMappingURL=placeholderRegistry.js.map