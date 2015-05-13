function assert(x, msg) {
  if (!x) {
    throw Error("assertion failed: " + msg);
  }
}

module.exports = assert;
