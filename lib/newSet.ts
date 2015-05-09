// Safari and Internet Explorer do not support the iterable parameter to the
// Set constructor.  We work around that by manually adding the items.

const newSetFromArray = (function() {
  try {
    if (new Set([1, 2]).size === 2) {
      return function createSetFromArray<T>(array: T[]): Set<T> {
        return new Set(array);
      };
    }
  } catch (e) {
  }
  return function createSetFromArray<T>(array: T[]): Set<T> {
    var set = new Set<T>();
    for (var i = 0; i < array.length; i++) {
      set.add(array[i]);
    }
    return set;
  }
})();

export default function newSet<T>(array?: T[]): Set<T> {
  return (array === void 0) ? new Set<T>() : newSetFromArray<T>(array);
}
