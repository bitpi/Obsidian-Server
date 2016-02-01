var Joi = require('joi');
var _ = require('lodash');
var Attribute = (function () {
    function Attribute(name, config) {
        this._name = name;
        var alternativeSchemas = _.map(Attribute.typeMap, function (value, key) {
            return Attribute.typeSchema(key);
        });
        var schema = Joi.alternatives(alternativeSchemas);
        var validationResult = Joi.validate(config, schema);
        if (validationResult.error) {
            throw validationResult.error;
        }
        var validatedObject = validationResult.value;
        this._type = validatedObject['type'];
        this._defaultValue = validatedObject['default'];
        this._index = validatedObject['index'];
        this._unique = validatedObject['unique'];
    }
    Attribute.typeSchema = function (type) {
        return Joi.object({
            'type': Joi.string().valid(type).required(),
            'default': Joi.alternatives([
                Attribute.typeMap[type],
                Joi.func()
            ]).optional(),
            'index': Joi.boolean().valid(true).optional(),
            'unique': Joi.boolean().valid(true).optional()
        });
    };
    ;
    Object.defineProperty(Attribute.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Attribute.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Attribute.prototype, "index", {
        get: function () {
            return this._index;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Attribute.prototype, "unique", {
        get: function () {
            return this._unique;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Attribute.prototype, "defaultValue", {
        get: function () {
            return this._defaultValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Attribute.prototype, "dbType", {
        get: function () {
            return Attribute.dbTypeMap[this.type];
        },
        enumerable: true,
        configurable: true
    });
    Attribute.typeMap = {
        'integer': Joi.number().integer(),
        'float': Joi.number(),
        'string': Joi.string(),
        'boolean': Joi.boolean(),
        'date': Joi.date()
    };
    Attribute.dbTypeMap = {
        'integer': 'integer',
        'float': 'float',
        'string': 'string',
        'boolean': 'boolean',
        'date': 'datetime'
    };
    return Attribute;
})();
module.exports = Attribute;
//# sourceMappingURL=attribute.js.map