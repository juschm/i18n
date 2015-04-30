import {quoteString} from './stringUtils';

function escapeHtmlAttributePart(value: string): string {
  return value.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;');
}

export function quoteHtmlAttribute(value: string): string {
  return quoteString(escapeHtmlAttributePart(value), '&quot;');
}
