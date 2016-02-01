var _ = require('lodash');
var Joi = require('joi');
var RelationshipType = require('./relationship_type');
var Relationship = (function () {
    function Relationship(name, config) {
        this._name = name;
        var validationResult = Joi.validate(config, Relationship.validationSchema);
        if (validationResult.error) {
            throw validationResult.error;
        }
        var validated = validationResult.value;
        this._type = Relationship.typeMap[validated['type']];
        this._resourceName = validated['resource'];
        this._targetRelationshipName = validated['target_relationship'];
    }
    Object.defineProperty(Relationship.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Relationship.prototype, "resourceName", {
        get: function () {
            return this._resourceName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Relationship.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Relationship.prototype, "targetRelationshipName", {
        get: function () {
            return this._targetRelationshipName;
        },
        enumerable: true,
        configurable: true
    });
    Relationship.typeMap = {
        has_one: RelationshipType.HasOne,
        has_many: RelationshipType.HasMany
    };
    Relationship.validationSchema = Joi.object({
        resource: Joi.string().min(1).alphanum().required(),
        type: Joi.string().valid(_.keys(Relationship.typeMap)).required(),
        target_relationship: Joi.string().min(1).alphanum().optional()
    });
    return Relationship;
})();
module.exports = Relationship;
//# sourceMappingURL=relationship.js.map