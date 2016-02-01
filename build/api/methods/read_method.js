var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var Joi = require('joi');
var Constants = require('../../config/constants');
var MappingHelpers = require('../../helpers/mapping_helpers');
var ResourceMethod = require('./resource_method');
var Response = require('../responses/response');
var ErrorResponse = require('../responses/error_response');
var ReadMethod = (function (_super) {
    __extends(ReadMethod, _super);
    function ReadMethod(resource, descriptor, model) {
        _super.call(this, resource, descriptor, model, Constants.HTTPVerb.GET);
    }
    ReadMethod.prototype.validators = function () {
        return _super.prototype.validators.call(this).concat([ReadMethod.endpointValidator]);
    };
    ReadMethod.prototype.handle = function (request, callback) {
        var self = this;
        var sortKeys = [];
        var sortList = request.params['sort'];
        if (!_.isEmpty(sortList)) {
            var sortComponents = sortList.split(',');
            var trimmedComponents = _.map(sortComponents, function (component) { return _.trim(component); });
            sortKeys = trimmedComponents;
        }
        var criteria = MappingHelpers.filterQueryStringNulls(request.params['criteria']);
        var pagination = request.params['pagination'];
        var include = request.params['include'];
        this.model.read(criteria, sortKeys, pagination.page, pagination.limit, include).then(function (records) {
            var response = new Response(self.resource.name, records || []);
            callback(response);
        }).catch(function (error) {
            var errorResponse = new ErrorResponse(error);
            callback(errorResponse);
        });
    };
    ReadMethod.endpointValidator = Joi.object({
        criteria: Joi.object().unknown().default({}),
        sort: Joi.string().optional().default(null),
        include: Joi.array().items(Joi.string().min(1)).optional(),
        pagination: Joi.object({
            page: Joi.number().integer().min(1).required(),
            limit: Joi.number().integer().min(1).required()
        }).default({
            page: 0,
            limit: 1
        })
    });
    return ReadMethod;
})(ResourceMethod);
module.exports = ReadMethod;
//# sourceMappingURL=read_method.js.map