var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var ResourceMethod = require('./resource_method');
var Response = require('../responses/response');
var ErrorResponse = require('../responses/error_response');
var CustomMethod = (function (_super) {
    __extends(CustomMethod, _super);
    function CustomMethod(resource, descriptor, model, models, config, verb, modulePath) {
        _super.call(this, resource, descriptor, model, verb);
        this._models = models;
        this._config = config;
        this._implementation = require(modulePath);
        if (!_.isFunction(this._implementation)) {
            var errorString = "Module at " + modulePath + " must export a single function.  For more details, visit https://engine.tendigi.com/";
            throw new Error(errorString);
        }
    }
    CustomMethod.prototype.handle = function (request, callback) {
        var self = this;
        var info = {
            models: this._models,
            config: this._config
        };
        this._implementation(request, info, function (error, object) {
            if (error) {
                var response = new ErrorResponse(error);
                callback(response);
            }
            else {
                var responseArray = [];
                if (_.isArray(object)) {
                    responseArray = object;
                }
                else if (object) {
                    responseArray.push(object);
                }
                var response = new Response(self.resource.name, responseArray);
                callback(response);
            }
        });
    };
    return CustomMethod;
})(ResourceMethod);
module.exports = CustomMethod;
//# sourceMappingURL=custom_method.js.map