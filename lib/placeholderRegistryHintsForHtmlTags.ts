// Work around ES6 Set constructor limitation in TypeScript 1.5.0-beta.
//
// In TypeScript 1.5.0-beta when using lib.es6.d.ts shipped with the compiler, the following line,
//
//     var m = new Map<string, string>([ ["a", "1"], ["b", "2"] ]);
//
// result in the following error.
//
//     TS2345: Argument of type 'string[][]' is not assignable to parameter of type 'Iterable<[{}, {}]>'.
//
// The cast of the Map constructor to <any> below is used to workaround this behavior.
const HTML_TAG_TO_PLACEHOLDER_NAME_HINTS: Map<string, string> = new (<any>Map)([
  ['A', 'LINK'],
  ['B', 'BOLD_TEXT'],
  ['BR', 'LINE_BREAK'],
  ['EM', 'EMPHASISED_TEXT'],
  ['H1', 'HEADING_LEVEL1'],
  ['H2', 'HEADING_LEVEL2'],
  ['H3', 'HEADING_LEVEL3'],
  ['H4', 'HEADING_LEVEL4'],
  ['H5', 'HEADING_LEVEL5'],
  ['H6', 'HEADING_LEVEL6'],
  ['HR', 'HORIZONTAL_RULE'],
  ['I', 'ITALIC_TEXT'],
  ['LI', 'LIST_ITEM'],
  ['LINK', 'MEDIA_LINK'],
  ['OL', 'ORDERED_LIST'],
  ['P', 'PARAGRAPH'],
  ['Q', 'QUOTATION'],
  ['S', 'STRIKETHROUGH_TEXT'],
  ['SMALL', 'SMALL_TEXT'],
  ['SUB', 'SUBSTRIPT'],
  ['SUP', 'SUPERSCRIPT'],
  ['TBODY', 'TABLE_BODY'],
  ['TD', 'TABLE_CELL'],
  ['TFOOT', 'TABLE_FOOTER'],
  ['TH', 'TABLE_HEADER_CELL'],
  ['THEAD', 'TABLE_HEADER'],
  ['TR', 'TABLE_ROW'],
  ['TT', 'MONOSPACED_TEXT'],
  ['U', 'UNDERLINED_TEXT'],
  ['UL', 'UNORDERED_LIST']
]);

export default function getNameHintForHtmlTag(tag: string) {
  var ucaseTag = tag.toUpperCase();
  var hint = HTML_TAG_TO_PLACEHOLDER_NAME_HINTS.get(ucaseTag);
  return hint === void 0 ? ucaseTag : hint;
}
