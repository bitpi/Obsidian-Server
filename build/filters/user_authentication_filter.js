var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var Joi = require('joi');
var Boom = require('boom');
var Promise = require('bluebird');
var Constants = require('../config/constants');
var Filter = require('./filter');
var UserAuthenticationAttributes = require('../modules/user_authentication/user_authentication_attributes');
var _filterName = 'user_authentication';
var UserAuthenticationFilter = (function (_super) {
    __extends(UserAuthenticationFilter, _super);
    function UserAuthenticationFilter(options) {
        var validationResult = Joi.validate(options, UserAuthenticationFilter.validationSchema);
        if (validationResult.error) {
            throw validationResult.error;
        }
        var validated = validationResult.value;
        this._resourceName = validated['resource'];
        this._matchAttribute = validated['match_attribute'];
        _super.call(this);
    }
    UserAuthenticationFilter.prototype.before = function (request) {
        var self = this;
        return _super.prototype.before.call(this, request).then(function () {
            return self.authenticateUser(request);
        });
    };
    UserAuthenticationFilter.prototype.authenticateUser = function (request) {
        var self = this;
        return new Promise(function (fulfill, reject) {
            var bearerToken = request.headers[Constants.AuthHeaders.bearerToken];
            if (_.isEmpty(bearerToken)) {
                var error = Boom.unauthorized();
                reject(error);
                return;
            }
            var criteria = {};
            criteria[UserAuthenticationAttributes.tokenAttribute.name] = bearerToken;
            var model = self.orm.model(self._resourceName);
            model.read(criteria, null, 1, 1).then(function (records) {
                if (_.isEmpty(records)) {
                    var error = Boom.unauthorized();
                    reject(error);
                }
                else {
                    var authenticatedUser = records[0];
                    if (self._matchAttribute) {
                        var idValidation = {};
                        idValidation[self._matchAttribute] = Joi.any().valid(authenticatedUser['id']).required();
                        var validationSchema = Joi.object({
                            criteria: Joi.object(idValidation).unknown()
                        }).unknown();
                        var validationResult = Joi.validate(request.params, validationSchema);
                        if (validationResult.error) {
                            var error = Boom.unauthorized();
                            reject(error);
                        }
                        else {
                            fulfill(undefined);
                        }
                    }
                    else {
                        fulfill(undefined);
                    }
                }
            });
        });
    };
    UserAuthenticationFilter.filterName = _filterName;
    UserAuthenticationFilter.validationSchema = Joi.object({
        resource: Joi.string().min(1).required(),
        match_attribute: Joi.string().min(1).optional()
    });
    return UserAuthenticationFilter;
})(Filter);
module.exports = UserAuthenticationFilter;
//# sourceMappingURL=user_authentication_filter.js.map