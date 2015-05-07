///<reference path='collections.d.ts'/>
///<reference path='../typings/node/node.d.ts'/>
/**
 * This is a facade around the minimal hashing interface that we're using for
 * fingerpriting.  We might need to do this from the browser or the command
 * line or entirely change the underlying libraries we would use to do it.
 */
var crypto = require('crypto');
var SHA1 = (function () {
    function SHA1() {
        this.shasum = crypto.createHash('sha1');
    }
    SHA1.prototype.update = function (text) {
        this.shasum.update(text, 'utf8');
    };
    SHA1.prototype.hexdigest = function () {
        var result = this.shasum.digest('hex');
        // destroy underlying object so that we can't call update() anymore.
        this.shasum = null;
        return result;
    };
    return SHA1;
})();
exports.SHA1 = SHA1;
//# sourceMappingURL=hashing.js.map