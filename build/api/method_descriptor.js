var Joi = require('joi');
var _ = require('lodash');
var FS = require('fs');
var Path = require('path');
var Constants = require('../config/constants');
var FilterLoader = require('../filters/filter_loader');
var MethodDescriptor = (function () {
    function MethodDescriptor(name, config) {
        var options = {
            name: name,
            config: config
        };
        var validationResult = Joi.validate(options, MethodDescriptor.validationSchema);
        if (validationResult.error) {
            throw validationResult.error;
        }
        var validated = validationResult.value;
        var endpointName = validated['name'];
        this._name = endpointName;
        this._type = MethodDescriptor.builtInNames[endpointName];
        if (this._type == undefined) {
            this._type == Constants.MethodType.Custom;
        }
        var validatedConfig = validated['config'];
        if (_.isObject(validatedConfig)) {
            var filters = validatedConfig['filters'];
            if (_.isObject(filters)) {
                this._filters = _.map(filters, function (object, key) {
                    return FilterLoader.loadFilter(key, object);
                });
            }
            var implementationPath = validatedConfig['implementation'];
            if (implementationPath) {
                var joined = implementationPath[0] == '/' ? implementationPath : Path.join(process.cwd(), implementationPath);
                FS.accessSync(joined, FS.R_OK);
                this._modulePath = joined.substr(0, joined.lastIndexOf('.js'));
                this._type = Constants.MethodType.Custom;
                this._method = validatedConfig['method'];
            }
        }
    }
    Object.defineProperty(MethodDescriptor.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodDescriptor.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodDescriptor.prototype, "filters", {
        get: function () {
            return this._filters;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodDescriptor.prototype, "modulePath", {
        get: function () {
            return this._modulePath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MethodDescriptor.prototype, "method", {
        get: function () {
            return this._method;
        },
        enumerable: true,
        configurable: true
    });
    MethodDescriptor.builtInNames = {
        create: Constants.MethodType.Create,
        read: Constants.MethodType.Read,
        update: Constants.MethodType.Update,
        destroy: Constants.MethodType.Destroy
    };
    MethodDescriptor.namesSchema = Joi.string().min(1).required();
    MethodDescriptor.configSchema = Joi.alternatives([
        Joi.boolean().valid(true),
        Joi.object({
            implementation: Joi.string(),
            method: Joi.string().valid(_.values(Constants.HTTPVerb)),
            filters: Joi.object().default({}).unknown()
        }).with('implementation', 'method').with('method', 'implementation')
    ]);
    MethodDescriptor.validationSchema = Joi.alternatives([
        Joi.object({
            name: MethodDescriptor.namesSchema,
            config: MethodDescriptor.configSchema
        })
    ]);
    return MethodDescriptor;
})();
module.exports = MethodDescriptor;
//# sourceMappingURL=method_descriptor.js.map