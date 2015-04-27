import * as M from './message_types';
export interface Serializer {
    stringify(obj: M.SerializableTypes): string;
    parse(s: string): M.SerializableTypes;
}
export interface CreateSerializer {
    (config?: any): Serializer;
}
export declare class SerializerRegistry {
    serializerFactories: Map<string, CreateSerializer>;
    constructor();
    register(name: string, factory: CreateSerializer): void;
    create(name: string, config?: any): Serializer;
}
declare var Registry: SerializerRegistry;
export default Registry;
