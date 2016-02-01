var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Joi = require('joi');
var _ = require('lodash');
var Logger = require('../app/logger');
var Configuration = require('./configuration');
var Metadata = require('../api/metadata');
var Resource = require('../api/resource');
var _semverRegex = require('semver-regex')();
var Resources = (function (_super) {
    __extends(Resources, _super);
    function Resources() {
        _super.apply(this, arguments);
        this._resources = [];
    }
    Resources.prototype.validate = function (json) {
        var result = Joi.validate(json, Resources.validationSchema);
        var error = result.error || _super.prototype.validate.call(this, result.value);
        if (error) {
            throw error;
        }
        var validated = result.value;
        this._metadata = new Metadata(validated['metadata']['name'], validated['metadata']['version']);
        Logger.info('Loaded service metadata (`' + this.metadata.name + '` version ' + this.metadata.version + ')', null, true);
        var resourceDicts = validated['resources'];
        var resources = _.map(resourceDicts, function (value, key) {
            var resource = new Resource(key, value);
            Logger.info('Loaded resource `' + key + '`', null, true);
            return resource;
        });
        _.each(resources, this.addResource, this);
    };
    Object.defineProperty(Resources.prototype, "metadata", {
        get: function () {
            return this._metadata;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Resources.prototype, "resources", {
        get: function () {
            return this._resources;
        },
        enumerable: true,
        configurable: true
    });
    Resources.prototype.addResource = function (resource) {
        if (this._resources) {
            this._resources.push(resource);
        }
        else {
            this._resources = [resource];
        }
    };
    Resources.validationSchema = Joi.object({
        metadata: Joi.object().required().keys({
            name: Joi.string().required(),
            version: Joi.string().regex(_semverRegex).required()
        }),
        resources: Joi.object().required()
    }).unknown(true);
    return Resources;
})(Configuration);
module.exports = Resources;
//# sourceMappingURL=resources.js.map