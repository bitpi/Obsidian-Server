var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var Joi = require('joi');
var Boom = require('boom');
var Constants = require('../../config/constants');
var ResourceMethod = require('./resource_method');
var Response = require('../responses/response');
var ErrorResponse = require('../responses/error_response');
var UpdateMethod = (function (_super) {
    __extends(UpdateMethod, _super);
    function UpdateMethod(resource, descriptor, model) {
        _super.call(this, resource, descriptor, model, Constants.HTTPVerb.PATCH);
    }
    UpdateMethod.prototype.validators = function () {
        var relationshipValidator = Joi.object({
            record: this.relationshipValidations
        });
        return _super.prototype.validators.call(this).concat([UpdateMethod.endpointValidator, relationshipValidator]);
    };
    UpdateMethod.prototype.handle = function (request, callback) {
        var self = this;
        var record = request.params['record'];
        var criteria = request.params['criteria'];
        this.model.update(criteria, record).then(function (records) {
            if (_.isEmpty(records)) {
                var errorMessage = 'No records were found matching your criteria';
                var notFound = Boom.notFound(errorMessage);
                var errorResponse = new ErrorResponse(notFound);
                callback(errorResponse);
            }
            else {
                var response = new Response(self.resource.name, records);
                callback(response);
            }
        }).catch(function (error) {
            var errorResponse = new ErrorResponse(error);
            callback(errorResponse);
        });
    };
    UpdateMethod.endpointValidator = Joi.object({
        record: Joi.object({
            id: Joi.any().forbidden()
        }).min(1).unknown().required(),
        criteria: Joi.object().min(1).unknown().required()
    });
    return UpdateMethod;
})(ResourceMethod);
module.exports = UpdateMethod;
//# sourceMappingURL=update_method.js.map