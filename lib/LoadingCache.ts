/**
 * Based on Guava's LoadCache<K, V>.
 *
 * Why not extend Map?
 * Read https://code.google.com/p/guava-libraries/wiki/MapMakerMigration#MapMaker_and_ConcurrentMap
 */

export interface Loader<K, V> {
  (key:K): V;
}

export class LoadingCache<K, V> {
  private _loader:Loader<K, V>;
  private _map:Map<K, V>;

  constructor(loader:Loader<K, V>) {
    this._map = new Map<K, V>();
    this._loader = loader;
  }

  get(key:K):V {
    var value:V = this._map.get(key);
    if (value === void 0) {
      value = this._loader(key);
      this._map.set(key, value);
    }
    return value;
  }

  asMap():Map<K, V> {
    return this._map;
  }
}

// Support importing from babeljs transpiled files.
export var __esModule = true;
