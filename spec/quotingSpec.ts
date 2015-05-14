/// <reference path="../typings/jasmine/jasmine.d.ts" />
require('source-map-support').install();

var quoteHtmlAttribute = require("../lib/quoting").quoteHtmlAttribute;

describe("quoting", function() {
  describe("quoteHtmlAttribute", function() {
    it("should wrap simple values in double quotes", function() {
      expect(quoteHtmlAttribute('')).toBe('""');
      expect(quoteHtmlAttribute('abc')).toBe('"abc"');
      expect(quoteHtmlAttribute("'''")).toBe("\"'''\"");
    });
    it("should wrap in single quotes if it avoids escaping quotes", function() {
      expect(quoteHtmlAttribute('"""')).toBe('\'"""\'');
    });
    it("should wrap in double quotes and escape double quotes when both quotes are present", function() {
      expect(quoteHtmlAttribute("''\"\"")).toBe('"\'\'&quot;&quot;"');
    });
    it("should escape ampersand", function() {
      expect(quoteHtmlAttribute('&')).toBe('"&amp;"');
      expect(quoteHtmlAttribute('&&&&')).toBe('"&amp;&amp;&amp;&amp;"');
      expect(quoteHtmlAttribute('&amp;&')).toBe('"&amp;amp;&amp;"');
    });
    it("should escape < and > symbols", function() {
      expect(quoteHtmlAttribute('<')).toBe('"&lt;"');
      expect(quoteHtmlAttribute('>')).toBe('"&gt;"');
      expect(quoteHtmlAttribute("<><<>><<")).toBe('"&lt;&gt;&lt;&lt;&gt;&gt;&lt;&lt;"');
    });
    it("should escape the ampersand first and then the < and > symbols", function() {
      expect(quoteHtmlAttribute('&&<><&<&>&>&<<&&')).toBe(
          '"&amp;&amp;&lt;&gt;&lt;&amp;&lt;&amp;&gt;&amp;&gt;&amp;&lt;&lt;&amp;&amp;"');
    });
  });
});
