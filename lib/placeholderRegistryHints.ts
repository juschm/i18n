import * as M from './message_types';
import {getNameHintForHtmlTag} from './placeholderRegistryHintsForHtmlTags';

export function getNameHintForPlaceholder(placeholder: M.ConcreteTagPair): string {
  if (placeholder instanceof M.TagPair) {
    var typeName = M.getStableTypeName(placeholder);
    switch (typeName) {
      case M.TYPENAME_HTML_TAG_PAIR:
        return getNameHintForHtmlTag(placeholder.tag);
      default:
        // NOTE: If/When we support different tag types, we want to come up with
        // a sane system of naming the generated placeholders instead of
        // generating one automatically here.  By throwing an error here, we
        // force ourselves to revisit this code and pick a good naming scheme.
        throw Error(`InternalError: Placeholder hints for tags of type "${typeName}" are not yet implemented.`);
    }
  } else {
    return (placeholder instanceof M.NgExpr) ? 'EXPRESSION' : 'PH';
  }
}
