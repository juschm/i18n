/// <reference path="../typings/jasmine/jasmine.d.ts" />
require('source-map-support').install();

import Counter from '../lib/Counter';

describe("Counter", function() {
  describe("initial value", function() {
    it("should count from 1 by default", function() {
      var counter = new Counter();
      expect(counter.next()).toEqual(1);
      expect(counter.next()).toEqual(2);
      expect(counter.next()).toEqual(3);
    });
    it("should accept and initial value", function() {
      var counter = new Counter(11);
      expect(counter.next()).toEqual(11);
      expect(counter.next()).toEqual(12);
      expect(counter.next()).toEqual(13);
    });
    it("should bind the next() property to it's this object", function() {
      var next = new Counter().next;
      expect(next()).toEqual(1);
      expect(next()).toEqual(2);
    });
  });
});
