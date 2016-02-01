var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var Joi = require('joi');
var BCrypt = require('bcrypt');
var MappingHelpers = require('../../helpers/mapping_helpers');
var Module = require('../module');
var StringHelpers = require('../../helpers/string_helpers');
var MethodDescriptor = require('../../api/method_descriptor');
var LoginMethod = require('./login_method');
var UserAuthenticationAttributes = require('./user_authentication_attributes');
var _attributes = [
    UserAuthenticationAttributes.tokenAttribute,
    UserAuthenticationAttributes.passwordAttribute
];
var UserAuthentication = (function (_super) {
    __extends(UserAuthentication, _super);
    function UserAuthentication(options) {
        var validationResult = Joi.validate(options, UserAuthentication.validationSchema);
        if (validationResult.error) {
            throw validationResult.error;
        }
        var validated = validationResult.value;
        var attributes = _.clone(_attributes);
        if (validated['email']) {
            attributes.push(UserAuthenticationAttributes.emailAttribute);
        }
        if (validated['username']) {
            attributes.push(UserAuthenticationAttributes.usernameAttribute);
        }
        _super.call(this, attributes);
        this._filteredKeys = _.map(_attributes, function (attribute) {
            return attribute.name;
        });
    }
    UserAuthentication.prototype.genSalt = function () {
        return new Promise(function (resolve, reject) {
            BCrypt.genSalt(function (err, salt) {
                if (err)
                    reject(err);
                else
                    resolve(salt);
            });
        });
    };
    UserAuthentication.prototype.hashPassword = function (salt, password) {
        return new Promise(function (resolve, reject) {
            BCrypt.hash(password, salt, function (err, hashed) {
                if (err)
                    reject(err);
                else
                    resolve(hashed);
            });
        });
    };
    UserAuthentication.prototype.generateHash = function (password) {
        var self = this;
        return this.genSalt().then(function (salt) {
            return self.hashPassword(salt, password);
        });
    };
    UserAuthentication.prototype.transformRequest = function (request) {
        return _super.prototype.transformRequest.call(this, request).bind(this).then(this.hashAndDelete);
    };
    UserAuthentication.prototype.transformResponse = function (response) {
        var self = this;
        return new Promise(function (fulfill, reject) {
            var modifiedResponseObject = MappingHelpers.filterKeys(response.responseObject, self._filteredKeys);
            response.responseObject = modifiedResponseObject;
            fulfill(response);
        });
    };
    UserAuthentication.prototype.hashAndDelete = function (request) {
        var self = this;
        return new Promise(function (fulfill, reject) {
            var params = request.params;
            var record = request.params['record'];
            if (record) {
                delete record[UserAuthenticationAttributes.tokenAttribute.name];
                var inputPassword = record[UserAuthenticationAttributes.passwordAttribute.name];
                if (inputPassword) {
                    self.generateHash(inputPassword).then(function (hashed) {
                        record[UserAuthenticationAttributes.passwordAttribute.name] = hashed;
                        params['record'] = record;
                        request.params = params;
                        fulfill(request);
                    }).catch(reject);
                }
                else {
                    params['record'] = record;
                    request.params = params;
                    fulfill(request);
                }
            }
            else {
                request.params = params;
                fulfill(request);
            }
        });
    };
    UserAuthentication.prototype.generateMethods = function (model, resource) {
        var methods = [];
        var loginMethodName = StringHelpers.prefixKey(UserAuthenticationAttributes.moduleName, 'login');
        var loginMethodDescriptor = new MethodDescriptor(loginMethodName, true);
        var loginMethod = new LoginMethod(resource, loginMethodDescriptor, model);
        methods.push(loginMethod);
        return _super.prototype.generateMethods.call(this, model, resource).concat(methods);
    };
    UserAuthentication.moduleName = UserAuthenticationAttributes.moduleName;
    UserAuthentication.validationSchema = Joi.object({
        email: Joi.boolean().valid(true),
        username: Joi.boolean().valid(true)
    }).or(['email', 'username']);
    return UserAuthentication;
})(Module);
module.exports = UserAuthentication;
//# sourceMappingURL=user_authentication.js.map