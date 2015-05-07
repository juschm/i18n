///<reference path="collections.d.ts" />
// Work around ES6 Set constructor limitation in TypeScript 1.5
//
// In TypeScript 1.5, the following line,
//
//     var s = new Set([1, 2, 3]);
//
// result in the following error.
//
//     TS2346: Supplied parameters do not match any signature of call target
//
// The following is a hack since I couldn't work around it easily (Iterable<T>
// is not recognized, etc. so much harder to expand the definition.)
function newSet(array) {
    return array === void 0 ? new Set() : new Set(array);
}
exports["default"] = newSet;
//# sourceMappingURL=newSet.js.map