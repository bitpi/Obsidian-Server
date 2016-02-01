var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Joi = require('joi');
var Constants = require('../../config/constants');
var ResourceMethod = require('./resource_method');
var Response = require('../responses/response');
var ErrorResponse = require('../responses/error_response');
var CreateMethod = (function (_super) {
    __extends(CreateMethod, _super);
    function CreateMethod(resource, descriptor, model) {
        _super.call(this, resource, descriptor, model, Constants.HTTPVerb.POST);
    }
    CreateMethod.prototype.validators = function () {
        var relationshipValidator = Joi.object({
            record: this.relationshipValidations
        });
        return _super.prototype.validators.call(this).concat([CreateMethod.endpointValidator, relationshipValidator]);
    };
    CreateMethod.prototype.handle = function (request, callback) {
        var self = this;
        var record = request.params['record'];
        this.model.create(record).then(function (record) {
            var response = new Response(self.resource.name, record, Constants.HTTPStatusCode.Created);
            callback(response);
        }).catch(function (error) {
            var response = new ErrorResponse(error);
            callback(response);
        });
    };
    CreateMethod.endpointValidator = Joi.object({
        record: Joi.object().unknown().default({})
    });
    return CreateMethod;
})(ResourceMethod);
module.exports = CreateMethod;
//# sourceMappingURL=create_method.js.map