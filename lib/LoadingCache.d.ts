/// <reference path="collections.d.ts" />
/**
 * Based on Guava's LoadCache<K, V>.
 *
 * Why not extend Map?
 * Read https://code.google.com/p/guava-libraries/wiki/MapMakerMigration#MapMaker_and_ConcurrentMap
 */
export interface Loader<K, V> {
    (key: K): V;
}
export declare class LoadingCache<K, V> {
    private _loader;
    private _map;
    constructor(loader: Loader<K, V>);
    get(key: K): V;
    asMap(): Map<K, V>;
}
export declare var __esModule: boolean;
