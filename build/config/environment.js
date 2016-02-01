var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Joi = require('joi');
var Configuration = require('./configuration');
var Environment = (function (_super) {
    __extends(Environment, _super);
    function Environment() {
        _super.apply(this, arguments);
    }
    Environment.prototype.validate = function (json) {
        var result = Joi.validate(json, Environment.validationSchema);
        var error = result.error || _super.prototype.validate.call(this, result.value);
        if (error) {
            throw error;
        }
    };
    Object.defineProperty(Environment.prototype, "config", {
        get: function () {
            return _super.prototype.get.call(this, 'config');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Environment.prototype, "modules", {
        get: function () {
            return _super.prototype.get.call(this, 'modules');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Environment.prototype, "custom", {
        get: function () {
            return _super.prototype.get.call(this, 'custom');
        },
        enumerable: true,
        configurable: true
    });
    Environment.validationSchema = Joi.object().keys({
        config: Joi.object().required(),
        modules: Joi.object().default({}),
        custom: Joi.object().default({})
    });
    return Environment;
})(Configuration);
module.exports = Environment;
//# sourceMappingURL=environment.js.map