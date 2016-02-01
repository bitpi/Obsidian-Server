var Promise = require('bluebird');
var Module = (function () {
    function Module(customAttributes) {
        this._customAttributes = customAttributes;
    }
    Object.defineProperty(Module.prototype, "customAttributes", {
        get: function () {
            return this._customAttributes;
        },
        enumerable: true,
        configurable: true
    });
    Module.prototype.transformRequest = function (request) {
        return new Promise(function (fulfill, reject) {
            fulfill(request);
        });
    };
    Module.prototype.transformResponse = function (response) {
        return new Promise(function (fulfill, reject) {
            fulfill(response);
        });
    };
    Module.prototype.generateMethods = function (model, resource) {
        return [];
    };
    return Module;
})();
module.exports = Module;
//# sourceMappingURL=module.js.map