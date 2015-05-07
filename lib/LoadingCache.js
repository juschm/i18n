///<reference path="collections.d.ts" />
var LoadingCache = (function () {
    function LoadingCache(loader) {
        this._map = new Map();
        this._loader = loader;
    }
    LoadingCache.prototype.get = function (key) {
        var value = this._map.get(key);
        if (value === void 0) {
            value = this._loader(key);
            this._map.set(key, value);
        }
        return value;
    };
    LoadingCache.prototype.asMap = function () {
        return this._map;
    };
    return LoadingCache;
})();
exports.LoadingCache = LoadingCache;
// Support importing from babeljs transpiled files.
exports.__esModule = true;
//# sourceMappingURL=LoadingCache.js.map