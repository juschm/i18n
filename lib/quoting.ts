import {quoteString} from './stringUtils';

function escapeHtmlAttributePart(value) {
  return value.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;');
}

export function quoteHtmlAttribute(value) {
  return quoteString(escapeHtmlAttributePart(value), '&quot;');
}
