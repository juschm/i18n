/// <reference path="collections.d.ts" />
/// <reference path="../typings/node/node.d.ts" />
export interface Hasher {
    update(data: any): any;
    hexdigest(): string;
}
export declare class SHA1 implements Hasher {
    private shasum;
    constructor();
    update(text: string): void;
    hexdigest(): string;
}
