var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var Joi = require('joi');
var Boom = require('boom');
var BCrypt = require('bcrypt');
var Constants = require('../../config/constants');
var ResourceMethod = require('../../api/methods/resource_method');
var Response = require('../../api/responses/response');
var ErrorResponse = require('../../api/responses/error_response');
var UserAuthenticationAttributes = require('./user_authentication_attributes');
var _validations = {};
_validations[UserAuthenticationAttributes.emailAttribute.name] = Joi.string().email();
_validations[UserAuthenticationAttributes.usernameAttribute.name] = Joi.string().min(1);
_validations[UserAuthenticationAttributes.passwordAttribute.name] = Joi.string().min(1).required();
var _criteriaValidation = Joi.object(_validations).unknown().or([UserAuthenticationAttributes.emailAttribute.name, UserAuthenticationAttributes.usernameAttribute.name]);
var LoginMethod = (function (_super) {
    __extends(LoginMethod, _super);
    function LoginMethod(resource, descriptor, model) {
        _super.call(this, resource, descriptor, model, Constants.HTTPVerb.POST);
    }
    LoginMethod.prototype.validators = function () {
        return _super.prototype.validators.call(this).concat([LoginMethod.validationSchema]);
    };
    LoginMethod.prototype.handle = function (request, callback) {
        var self = this;
        var criteria = request.params['criteria'];
        var orCriteria = [];
        if (criteria[UserAuthenticationAttributes.emailAttribute.name]) {
            var match = {};
            match[UserAuthenticationAttributes.emailAttribute.name] = criteria[UserAuthenticationAttributes.emailAttribute.name];
            orCriteria.push(match);
        }
        if (criteria[UserAuthenticationAttributes.usernameAttribute.name]) {
            var match = {};
            match[UserAuthenticationAttributes.usernameAttribute.name] = criteria[UserAuthenticationAttributes.usernameAttribute.name];
            orCriteria.push(match);
        }
        var password = criteria[UserAuthenticationAttributes.passwordAttribute.name];
        this.model.read({
            or: orCriteria
        }, null, 1, 1).then(function (records) {
            if (_.isEmpty(records)) {
                var error = Boom.unauthorized();
                var errorResponse = new ErrorResponse(error);
                callback(errorResponse);
                return;
            }
            var user = records[0];
            var hash = user[UserAuthenticationAttributes.passwordAttribute.name];
            BCrypt.compare(password, hash, function (err, same) {
                if (err || !same) {
                    var error = Boom.unauthorized();
                    var errorResponse = new ErrorResponse(error);
                    callback(errorResponse);
                }
                else {
                    var response = new Response(self.resource.name, records);
                    var token = user[UserAuthenticationAttributes.tokenAttribute.name];
                    response.addResponseHeader(Constants.AuthHeaders.bearerToken, token);
                    callback(response);
                }
            });
        }).catch(function (error) {
            var errorResponse = new ErrorResponse(error);
            callback(errorResponse);
        });
    };
    LoginMethod.validationSchema = Joi.object({
        criteria: _criteriaValidation.required()
    });
    return LoginMethod;
})(ResourceMethod);
module.exports = LoginMethod;
//# sourceMappingURL=login_method.js.map