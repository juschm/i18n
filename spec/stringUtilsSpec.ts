/// <reference path="../typings/jasmine/jasmine.d.ts" />
require('source-map-support').install();

var stringUtils = require("../lib/stringUtils"),
    splitN      = stringUtils.splitN,
    quoteString = stringUtils.quoteString;

describe("stringUtils", function() {
  describe("quoteString", function() {
    describe("default escaping (i.e. for JS)", function() {
      describe("no escaping required", function() {
        it('should wrap with double quotes when no quotes are present', function() {
          expect(quoteString('abc')).toBe('"abc"');
        });
        it('should wrap with double quotes when only single quotes are present', function() {
          expect(quoteString('abc\'')).toBe('"abc\'"');
        });
        it('should wrap with single quotes when only double quotes are present', function() {
          expect(quoteString('ab"c')).toBe("'ab\"c'");
        });
      });
      describe("escaping required", function() {
        it("should wrap and escape double quotes when both quotes are present", function() {
          expect(quoteString('ab\'\'""\'\'""c')).toBe('"ab\'\'\\"\\"\'\'\\"\\"c"');
        });
      });
    });
    describe("custom escaping", function() {
      var alt = "['\"]"; // custom double quote replacement string.
      describe("no escaping required", function() {
        it('should wrap with double quotes when no quotes are present', function() {
          expect(quoteString('abc', alt)).toBe('"abc"');
        });
        it('should wrap with double quotes when only single quotes are present', function() {
          expect(quoteString('abc\'', alt)).toBe('"abc\'"');
        });
        it('should wrap with single quotes when only double quotes are present', function() {
          expect(quoteString('ab"c', alt)).toBe("'ab\"c'");
        });
      });
      describe("escaping required", function() {
        it("should wrap and escape double quotes when both quotes are present", function() {
          expect(quoteString('ab\'\'""\'\'""c', alt)).toBe('"ab\'\'[\'"][\'"]\'\'[\'"][\'"]c"');
        });
      });
    });
  });
  describe("splitN", function() {
    function withFromRight(fromRight) {
      describe("fromRight="+fromRight, function() {
        describe("validation", function() {
          it("should throw an exception when the separator is the empty string", function() {
            expect(function() { return splitN("x", "", undefined, fromRight); }).toThrow("separator cannot be an empty string");
            expect(function() { return splitN("x", "", 1, fromRight); }).toThrow("separator cannot be an empty string");
          });
          it("should throw an exception when maxTimes is invalid", function() {
            expect(function() { return splitN("a", "a", "MUST BE NUMBER", fromRight); }).toThrow("maxTimes must be an integer >= -1");
            expect(function() { return splitN("a", "a", -2, fromRight); }).toThrow("maxTimes must be an integer >= -1");
            expect(function() { return splitN("a", "a", 1.2, fromRight); }).toThrow("maxTimes must be an integer >= -1");
          });
        });
        describe("0 splits", function() {
          it("should return a single element array containing the input string", function() {
            expect(splitN("", ".", 0, fromRight)).toEqual([""]);
            expect(splitN(".", ".", 0, fromRight)).toEqual(["."]);
            expect(splitN("a.b", ".", 0, fromRight)).toEqual(["a.b"]);
          });
        });
        describe("single split", function() {
          describe("no match", function() {
            it("should return just a single item in the result which is the original string", function() {
              expect(splitN("a", ".", 1, fromRight)).toEqual(["a"]);
            });
          });
          describe("matches at head", function() {
            it("should have an empty string as the first item in the result", function() {
              expect(splitN(".a", ".", 1, fromRight)).toEqual(["", "a"]);
            });
          });
          describe("matches at tail", function() {
            it("should have an empty string as the last item in the result", function() {
              expect(splitN("a.", ".", 1, fromRight)).toEqual(["a", ""]);
            });
          });
          it("should return a single element array containing the input string", function() {
            expect(splitN("", ",", 0, fromRight)).toEqual([""]);
            expect(splitN("a.b", ".", 0, fromRight)).toEqual(["a.b"]);
          });
        });
        describe("unspecified number of splits", function() {
          it("should handle no match", function() {
            expect(splitN("", ".", undefined, fromRight)).toEqual([""]);
            expect(splitN("abc", ".", undefined, fromRight)).toEqual(["abc"]);
          });
          it("should handle matches at all locations", function() {
            expect(splitN(".", ".", undefined, fromRight)).toEqual(["", ""]);
            expect(splitN("....", ".", undefined, fromRight)).toEqual(["", "", "", "", ""]);
          });
          it("should handle overlapping matches", function() {
            expect(splitN("...", "..", undefined, fromRight)).toEqual(
                fromRight ? [".", ""] : ["", "."]);
            expect(splitN("x...x", "..", undefined, fromRight)).toEqual(
                fromRight ? ["x.", "x"]: ["x", ".x"]);
            expect(splitN("....", "..", undefined, fromRight)).toEqual(["", "", ""]);
            expect(splitN("x....x", "..", undefined, fromRight)).toEqual(["x", "", "x"]);
          });
          it("should handle some common cases", function() {
            expect(splitN("a,b,c,d,e", ",", undefined, fromRight)).toEqual(["a", "b", "c", "d", "e"]);
          });
        });
      });
    }

    withFromRight(undefined);
    withFromRight(false);
    withFromRight(true);
  });
});
