///<reference path='../typings/node/node.d.ts'/>
import * as assert from 'assert';

// TODO: Get type definitions for parse5 and convert this to an import statement.
const parse5 = require('parse5');

// TODO: Need a definitions file for parse5.
export type Node = any;  // A parse5 returned node object.
export type Attr = any;  // A parse5 returned attribute object.

const _ADAPTER = parse5.TreeAdapters.default;

export const adapter = _ADAPTER;

// Returns the root element.
export function parseHtml(html: string) {
  let parser = new parse5.Parser(_ADAPTER);
  let root = parser.parse(html);
  // Normally, "root" is the document node and contains the optional doctype
  // node and the HTML node as children.  We'll skip the doctype node and
  // return the only HTML node.
  let element = null;
  for (let child of _ADAPTER.getChildNodes(root)) {
    if (!_ADAPTER.isDocumentTypeNode(child)) {
      if (element !== null) {
        throw Error("Found more than one element at the root level while parsing HTML text");
      }
      element = child;
    }
  }
  return element;
}
