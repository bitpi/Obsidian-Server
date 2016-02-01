var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var Joi = require('joi');
var Method = require('./method');
var ResourceMethod = (function (_super) {
    __extends(ResourceMethod, _super);
    function ResourceMethod(resource, descriptor, model, verb) {
        _super.call(this, verb, descriptor.name);
        this._resource = resource;
        this._descriptor = descriptor;
        this._model = model;
    }
    ResourceMethod.prototype.transformRequest = function (request) {
        var superPromise = _super.prototype.transformRequest.call(this, request);
        return _.reduce(this.resource.modules, function (p, m) {
            return p.then(function (req) {
                return m.transformRequest(req);
            });
        }, superPromise);
    };
    ResourceMethod.prototype.transformResponse = function (response) {
        var superPromise = _super.prototype.transformResponse.call(this, response);
        return _.reduce(this.resource.modules, function (p, m) {
            return p.then(function (res) {
                return m.transformResponse(res);
            });
        }, superPromise);
    };
    Object.defineProperty(ResourceMethod.prototype, "resource", {
        get: function () {
            return this._resource;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceMethod.prototype, "descriptor", {
        get: function () {
            return this._descriptor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceMethod.prototype, "model", {
        get: function () {
            return this._model;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceMethod.prototype, "relationshipValidations", {
        get: function () {
            var validations = {};
            _.each(this.resource.relationships, function (relationship) {
                validations[relationship.name] = ResourceMethod.idValidator;
            });
            return Joi.object(validations).unknown();
        },
        enumerable: true,
        configurable: true
    });
    ResourceMethod.idValidator = Joi.alternatives([
        Joi.string().min(1),
        Joi.number().integer().min(0),
        Joi.any().valid(null)
    ]);
    return ResourceMethod;
})(Method);
module.exports = ResourceMethod;
//# sourceMappingURL=resource_method.js.map