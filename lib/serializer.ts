import * as M from './message_types';

export interface Serializer {
  stringify(obj: M.SerializableTypes): string;
  parse(s: string): M.SerializableTypes;
}

export interface CreateSerializer {
  (config?: any): Serializer
}

export class SerializerRegistry {
  serializerFactories: Map<string, CreateSerializer>;
  
  constructor() {
    this.serializerFactories = new Map<string, CreateSerializer>();
  }

  register(name: string, factory: CreateSerializer) {
    if (this.serializerFactories.has(name)) {
      throw Error(`Error: Attempting to register a duplicate serializer for name ${name}.`);
    }
    this.serializerFactories.set(name, factory);
  }

  create(name: string, config?: any) {
    var factory: CreateSerializer = this.serializerFactories.get(name);
    if (factory === void 0) {
      throw Error(`Error: Unknown serializer ${name} requested.`);
    }
    return config === void 0 ? factory() : factory(config);
  }
}

var Registry = new SerializerRegistry();

export default Registry;
