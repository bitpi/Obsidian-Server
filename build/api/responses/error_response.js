var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var Boom = require('boom');
var Constants = require('../../config/constants');
var Response = require('./response');
var ErrorResponse = (function (_super) {
    __extends(ErrorResponse, _super);
    function ErrorResponse(error) {
        var boomError;
        if (error.isBoom) {
            boomError = error;
        }
        else if (error.code == 'E_VALIDATION') {
            var reasons = error.messages;
            var data = {
                reasons: reasons
            };
            boomError = Boom.create(error.status, "Validation Failed", data);
        }
        else if (error.name == 'ValidationError') {
            var joiError = error;
            var reasons = {};
            _.each(joiError.details, function (detail) {
                reasons[detail.path] = detail.message;
            });
            var data = {
                reasons: reasons
            };
            boomError = Boom.create(Constants.HTTPStatusCode.UnprocessableEntity, "Validation Failed", data);
        }
        else if (_.isString(error.details)) {
            boomError = Boom.create(Constants.HTTPStatusCode.InternalServerError, error.details);
        }
        else if (_.isString(error.message)) {
            boomError = Boom.create(Constants.HTTPStatusCode.InternalServerError, error.message);
        }
        else {
            boomError = Boom.wrap(error);
        }
        var payload = this.generatePayload(boomError);
        _super.call(this, Constants.ResponseType.error, payload, boomError.output.statusCode);
    }
    ErrorResponse.prototype.generatePayload = function (error) {
        var payload = {};
        payload.error = error.output.payload.error;
        payload.message = error.message || error.output.payload.message;
        if (error.data && error.data.reasons) {
            payload.reasons = error.data.reasons;
        }
        return payload;
    };
    return ErrorResponse;
})(Response);
module.exports = ErrorResponse;
//# sourceMappingURL=error_response.js.map