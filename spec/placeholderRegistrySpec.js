"use strict";

require('source-map-support').install();

var message_types = require("../lib/message_types");
var PlaceholderRegistry = require("../lib/placeholderRegistry").default;
var assert = require("assert");


// Currently only works on maps with string keys.
function mapToObj(map) {
  if (!(map instanceof Map)) {
    return map;
  }
  var result = {};
  map.forEach(function(value, key) {
    assert(typeof key === "string");
    result[key] = value;
  });
  return result;
}

function toSimpleObject(obj) {
  if (obj == null || typeof obj === "string" || typeof obj === "number") {
    return obj;
  }
  if (obj instanceof Map) {
    return toSimpleObject(mapToObj(obj));
  }
  if (obj instanceof Array) {
    var simpleObj = [];
    for (var i = 0; i < obj.length; i++) {
      simpleObj.push(toSimpleObject(obj[i]));
    }
    return simpleObj;
  }
  if (obj instanceof Object) {
    var simpleObj = {};
    Object.keys(obj).forEach(function(k) {
      simpleObj[k] = toSimpleObject(obj[k]);
    });
    return simpleObj;
  }
  return obj;
}


function toEqualSimplifiedObject(expected) {
  this.actual = toSimpleObject(this.actual);
  return jasmine.Matchers.prototype.toEqual.call(this, toSimpleObject(expected));
}

beforeEach(function() {
  this.addMatchers({toEqualSimplifiedObject: toEqualSimplifiedObject});
});


describe("PlaceholderRegistry", function() {
  describe("assumptions", function() {
    expect(true + true).toBe(2);
    expect(false + false).toBe(0);
  });

  describe("constructor", function() {
    it("ckck", function() {
      var registry = new PlaceholderRegistry();
      expect({a:[1]}).toEqual({a:[1]});
      expect(registry.toMap()).toEqualSimplifiedObject({});
      // var ngExpr = new message_types.NgExpr(undefined, "original text", ["ex_01", "ex_02"], "comment");
      registry.updatePlaceholder(new message_types.NgExpr("NAME", "original text", ["ex_01", "ex_02"], "comment"));
      // registry.updatePlaceholder(new message_types.NgExpr(void 0, "original text1", ["ex_03", "ex_02"], "comment"));
      // registry.updatePlaceholder(new message_types.NgExpr(void 0, "original text2", ["ex_04", "ex_02"], "comment"));
      console.log(JSON.stringify(toSimpleObject(registry.toMap()), 2));
      expect(registry.toMap()).toEqualSimplifiedObject({
          "NAME": {
              name: "NAME",
              text: "original text",
              examples: ["ex_01", "ex_02"],
              comment: "comment",
              }
          });
    });
  });
});
