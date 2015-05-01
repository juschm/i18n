import { AppConfig } from './config';
export declare class Extractor {
    config: AppConfig;
    constructor(config: AppConfig);
    writeMessagesToJson(messages: any): void;
    run(): void;
    debugRun(): void;
}
export default function main(): void;
