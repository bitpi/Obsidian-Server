var Promise = require('bluebird');
var Boom = require('boom');
var ErrorResponse = require('../responses/error_response');
var Method = (function () {
    function Method(verb, name) {
        this._verb = verb;
        this._name = name;
    }
    Method.prototype.validators = function () {
        return [];
    };
    Method.prototype.handle = function (request, callback) {
        var response = new ErrorResponse(Boom.notFound());
        callback(response);
    };
    Method.prototype.transformRequest = function (request) {
        return new Promise(function (fulfill, reject) {
            fulfill(request);
        });
    };
    Method.prototype.transformResponse = function (response) {
        return new Promise(function (fulfill, reject) {
            fulfill(response);
        });
    };
    Object.defineProperty(Method.prototype, "verb", {
        get: function () {
            return this._verb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Method.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Method.prototype, "filters", {
        get: function () {
            return this._filters;
        },
        set: function (filters) {
            this._filters = filters;
        },
        enumerable: true,
        configurable: true
    });
    return Method;
})();
module.exports = Method;
//# sourceMappingURL=method.js.map