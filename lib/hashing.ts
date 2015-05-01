///<reference path='../typings/node/node.d.ts'/>

/**
 * This is a facade around the minimal hashing interface that we're using for
 * fingerpriting.  We might need to do this from the browser or the command
 * line or entirely change the underlying libraries we would use to do it.
 */

import * as crypto from 'crypto';

export interface Hasher {
  update(data);
  hexdigest(): string;
}

export class SHA1 implements Hasher {
  private shasum;

  constructor() {
    this.shasum = crypto.createHash('sha1');
  }

  update(text: string) {
    this.shasum.update(text, 'utf8');
  }

  hexdigest(): string {
    var result = this.shasum.digest('hex');
    // destroy underlying object so that we can't call update() anymore.
    this.shasum = null;
    return result;
  }
}
