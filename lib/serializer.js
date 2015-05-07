var SerializerRegistry = (function () {
    function SerializerRegistry() {
        this.serializerFactories = new Map();
    }
    SerializerRegistry.prototype.register = function (name, factory) {
        if (this.serializerFactories.has(name)) {
            throw Error("Error: Attempting to register a duplicate serializer for name " + name + ".");
        }
        this.serializerFactories.set(name, factory);
    };
    SerializerRegistry.prototype.create = function (name, config) {
        var factory = this.serializerFactories.get(name);
        if (factory === void 0) {
            throw Error("Error: Unknown serializer " + name + " requested.");
        }
        return config === void 0 ? factory() : factory(config);
    };
    return SerializerRegistry;
})();
exports.SerializerRegistry = SerializerRegistry;
var Registry = new SerializerRegistry();
exports["default"] = Registry;
//# sourceMappingURL=serializer.js.map