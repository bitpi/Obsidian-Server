var Joi = require('joi');
var _ = require('lodash');
var Constants = require('../config/constants');
var Attribute = require('./attribute');
var Relationship = require('./relationship');
var MethodDescriptor = require('./method_descriptor');
var ModuleLoader = require('../modules/module_loader');
var Resource = (function () {
    function Resource(name, config, internal) {
        if (internal === void 0) { internal = false; }
        var self = this;
        this._name = name;
        this._internal = internal;
        var validationResult = Joi.validate(config, Resource.validationSchema);
        if (validationResult.error) {
            throw validationResult.error;
        }
        var validatedObject = validationResult.value;
        this._db = validatedObject['db'];
        this._attributes = _.map(validatedObject['attributes'], function (object, key) {
            return new Attribute(key, object);
        });
        this._relationships = _.map(validatedObject['relationships'], function (object, key) {
            return new Relationship(key, object);
        });
        this._methodDescriptors = _.map(validatedObject['methods'], function (object, key) {
            return new MethodDescriptor(key, object);
        });
        this._modules = _.map(validatedObject['modules'], function (object, key) {
            var module = ModuleLoader.loadModule(key, object);
            _.each(module.customAttributes, function (attribute) {
                self._attributes.push(attribute);
            });
            return module;
        });
    }
    Object.defineProperty(Resource.prototype, "connection", {
        get: function () {
            return this._db;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Resource.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Resource.prototype, "attributes", {
        get: function () {
            return this._attributes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Resource.prototype, "relationships", {
        get: function () {
            return this._relationships;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Resource.prototype, "methodDescriptors", {
        get: function () {
            return this._methodDescriptors;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Resource.prototype, "modules", {
        get: function () {
            return this._modules;
        },
        enumerable: true,
        configurable: true
    });
    Resource.validationSchema = Joi.object({
        attributes: Joi.object().default({}),
        relationships: Joi.object().default({}),
        methods: Joi.object().default({}),
        modules: Joi.object().default({}),
        db: Joi.string().default(Constants.defaultDBAdapterName)
    });
    return Resource;
})();
module.exports = Resource;
//# sourceMappingURL=resource.js.map