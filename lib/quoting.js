var stringUtils_1 = require('./stringUtils');
function escapeHtmlAttributePart(value) {
    return value.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
function quoteHtmlAttribute(value) {
    return stringUtils_1.quoteString(escapeHtmlAttributePart(value), '&quot;');
}
exports.quoteHtmlAttribute = quoteHtmlAttribute;
//# sourceMappingURL=quoting.js.map